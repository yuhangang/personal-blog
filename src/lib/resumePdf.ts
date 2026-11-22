import { readFile } from "node:fs/promises";
import path from "node:path";
import fontkit from "@pdf-lib/fontkit";
import {
  LineCapStyle,
  LineJoinStyle,
  PDFDocument,
  PDFString,
  PageSizes,
  appendBezierCurve,
  closePath,
  fillAndStroke,
  lineTo,
  moveTo,
  popGraphicsState,
  pushGraphicsState,
  rgb,
  setCharacterSpacing,
  setFillingColor,
  setLineCap,
  setLineJoin,
  setLineWidth,
  setStrokingColor,
  stroke,
  type Color,
  type PDFFont,
  type PDFPage,
} from "pdf-lib";
import {
  EXPERIENCES,
  PROJECTS,
  RESUME_CONTACT,
  RESUME_SUMMARY,
  SKILL_GROUPS,
} from "@/data/experience";

// ISO A4: 210mm x 297mm (595.28 x 841.89 pt)
const [PAGE_WIDTH, PAGE_HEIGHT] = PageSizes.A4;
const MARGIN_X = 42;
const MARGIN_TOP = 38;
const MARGIN_BOTTOM = 44;
const CONTENT_WIDTH = PAGE_WIDTH - MARGIN_X * 2;
const FOOTER_RULE_Y = 32;
const FOOTER_TEXT_Y = 20;

const CARD_RADIUS = 12;
const CARD_PAD_X = 16;
const CARD_INNER_WIDTH = CONTENT_WIDTH - CARD_PAD_X * 2;
const BEZIER_KAPPA = 0.5522847498;

// Kertas & Dakwat tokens matching src/styles/_kertas.scss
const COLOR_PAPER = rgb(250 / 255, 248 / 255, 245 / 255); // --kertas-ground: #faf8f5
const COLOR_CARD = rgb(1, 1, 1); // --kertas: #ffffff
const COLOR_RULE = rgb(236 / 255, 235 / 255, 231 / 255); // --kertas-3: #ecebe7
const COLOR_CARD_BORDER = rgb(233 / 255, 230 / 255, 224 / 255); // --pad-hairline over #faf8f5
const COLOR_INK = rgb(29 / 255, 26 / 255, 22 / 255); // --dakwat: #1d1a16
const COLOR_INK_2 = rgb(69 / 255, 66 / 255, 61 / 255); // --dakwat-2: #45423d
const COLOR_INK_3 = rgb(107 / 255, 103 / 255, 96 / 255); // --dakwat-3: #6b6760

export const RESUME_PDF_FILENAME = "Yu_Hang_Ang_Resume_A4.pdf";

interface FontPack {
  serifBold: PDFFont;
  serifItalic: PDFFont;
  sans: PDFFont;
  sansMedium: PDFFont;
}

interface FontBuffers {
  caudexBold: Uint8Array;
  caudexItalic: Uint8Array;
  jostRegular: Uint8Array;
  jostMedium: Uint8Array;
}

interface CardEntryBlock {
  height: number;
  draw: (page: PDFPage, topY: number) => void;
}

let cachedFontBuffers: Promise<FontBuffers> | null = null;

function loadFontBuffers(): Promise<FontBuffers> {
  if (!cachedFontBuffers) {
    const fontsDir = path.join(process.cwd(), "src", "assets", "fonts");
    cachedFontBuffers = Promise.all([
      readFile(path.join(fontsDir, "Caudex-Bold.ttf")),
      readFile(path.join(fontsDir, "Caudex-Italic.ttf")),
      readFile(path.join(fontsDir, "Jost-Regular.ttf")),
      readFile(path.join(fontsDir, "Jost-Medium.ttf")),
    ]).then(([caudexBold, caudexItalic, jostRegular, jostMedium]) => ({
      caudexBold,
      caudexItalic,
      jostRegular,
      jostMedium,
    }));
  }
  return cachedFontBuffers;
}

function cleanText(input: string): string {
  return input
    .replace(/\u2197/g, "")
    .replace(/\u00A0/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function wrapLines(
  text: string,
  font: PDFFont,
  fontSize: number,
  maxWidth: number
): string[] {
  const clean = cleanText(text);
  if (!clean) return [];

  const words = clean.split(" ");
  const lines: string[] = [];
  let currentLine = "";

  for (const word of words) {
    const candidate = currentLine ? `${currentLine} ${word}` : word;
    if (font.widthOfTextAtSize(candidate, fontSize) <= maxWidth) {
      currentLine = candidate;
      continue;
    }

    if (currentLine) {
      lines.push(currentLine);
      currentLine = "";
    }

    if (font.widthOfTextAtSize(word, fontSize) <= maxWidth) {
      currentLine = word;
    } else {
      let chunk = "";
      for (const char of word) {
        const nextChunk = chunk + char;
        if (font.widthOfTextAtSize(nextChunk, fontSize) > maxWidth && chunk) {
          lines.push(chunk);
          chunk = char;
        } else {
          chunk = nextChunk;
        }
      }
      currentLine = chunk;
    }
  }

  if (currentLine) lines.push(currentLine);
  return lines;
}

function addUriLink(
  doc: PDFDocument,
  page: PDFPage,
  x: number,
  y: number,
  width: number,
  height: number,
  uri: string
) {
  const annot = doc.context.obj({
    Type: "Annot",
    Subtype: "Link",
    Rect: [x, y, x + width, y + height],
    Border: [0, 0, 0],
    A: {
      Type: "Action",
      S: "URI",
      URI: PDFString.of(uri),
    },
  });
  page.node.addAnnot(doc.context.register(annot));
}

function drawRoundedCard(
  page: PDFPage,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number
) {
  const r = Math.min(radius, width / 2, height / 2);
  const k = r * BEZIER_KAPPA;

  page.pushOperators(
    pushGraphicsState(),
    setFillingColor(COLOR_CARD),
    setStrokingColor(COLOR_CARD_BORDER),
    setLineWidth(0.65),
    moveTo(x + r, y),
    lineTo(x + width - r, y),
    appendBezierCurve(x + width - r + k, y, x + width, y + r - k, x + width, y + r),
    lineTo(x + width, y + height - r),
    appendBezierCurve(
      x + width,
      y + height - r + k,
      x + width - r + k,
      y + height,
      x + width - r,
      y + height
    ),
    lineTo(x + r, y + height),
    appendBezierCurve(
      x + r - k,
      y + height,
      x,
      y + height - r + k,
      x,
      y + height - r
    ),
    lineTo(x, y + r),
    appendBezierCurve(x, y + r - k, x + r - k, y, x + r, y),
    closePath(),
    fillAndStroke(),
    popGraphicsState()
  );
}

/**
 * Draws a crisp vector ArrowUpRight matching Lucide's icon on /resume without injecting
 * stray arrow glyphs into ATS text streams.
 */
function drawArrowUpRight(
  page: PDFPage,
  x: number,
  baselineY: number,
  size: number,
  color: Color
) {
  const y = baselineY + 0.6;
  const tipX = x + size;
  const tipY = y + size;
  const head = size * 0.62;

  page.pushOperators(
    pushGraphicsState(),
    setStrokingColor(color),
    setLineWidth(0.7),
    setLineCap(LineCapStyle.Round),
    setLineJoin(LineJoinStyle.Round),
    // Diagonal shaft
    moveTo(x + size * 0.12, y + size * 0.12),
    lineTo(tipX, tipY),
    // Arrowhead
    moveTo(tipX - head, tipY),
    lineTo(tipX, tipY),
    lineTo(tipX, tipY - head),
    stroke(),
    popGraphicsState()
  );
}

/**
 * Uses PDF Tc (character spacing) inside a scoped graphics state so uppercase kickers
 * match the page's editorial tracking while preserving intact words in ATS/text extraction.
 */
function drawTrackedText(
  page: PDFPage,
  text: string,
  x: number,
  y: number,
  font: PDFFont,
  size: number,
  tracking: number,
  color: Color
) {
  const safe = cleanText(text);
  page.pushOperators(pushGraphicsState(), setCharacterSpacing(tracking));
  page.drawText(safe, { x, y, size, font, color });
  page.pushOperators(popGraphicsState());
}

function drawWrappedBlock(
  page: PDFPage,
  lines: string[],
  x: number,
  startY: number,
  font: PDFFont,
  size: number,
  lineHeight: number,
  color: Color
): number {
  let y = startY;
  for (const line of lines) {
    page.drawText(line, { x, y, size, font, color });
    y -= lineHeight;
  }
  return y;
}

function drawDashBullets(
  page: PDFPage,
  wrappedBullets: string[][],
  x: number,
  startY: number,
  font: PDFFont,
  fontSize: number,
  lineHeight: number,
  bulletIndent: number,
  itemGap: number
): number {
  let y = startY;
  for (let i = 0; i < wrappedBullets.length; i++) {
    const lines = wrappedBullets[i];
    if (lines.length === 0) continue;

    // Subtle hairline dash matching .bulletItem::before on /resume
    const dashY = y + fontSize * 0.32;
    page.drawLine({
      start: { x, y: dashY },
      end: { x: x + 4.2, y: dashY },
      thickness: 0.7,
      color: COLOR_INK_3,
    });

    y = drawWrappedBlock(
      page,
      lines,
      x + bulletIndent,
      y,
      font,
      fontSize,
      lineHeight,
      COLOR_INK_2
    );

    if (i < wrappedBullets.length - 1) {
      y -= itemGap;
    }
  }
  return y;
}

class A4Composer {
  readonly doc: PDFDocument;
  readonly fonts: FontPack;
  readonly pages: PDFPage[] = [];
  page!: PDFPage;
  y = PAGE_HEIGHT - MARGIN_TOP;

  constructor(doc: PDFDocument, fonts: FontPack) {
    this.doc = doc;
    this.fonts = fonts;
    this.addPage();
  }

  addPage(): PDFPage {
    const page = this.doc.addPage(PageSizes.A4);
    // Warm paper ground (--kertas-ground: #faf8f5)
    page.drawRectangle({
      x: 0,
      y: 0,
      width: PAGE_WIDTH,
      height: PAGE_HEIGHT,
      color: COLOR_PAPER,
    });
    this.pages.push(page);
    this.page = page;
    this.y = PAGE_HEIGHT - MARGIN_TOP;
    return page;
  }

  availableHeight(): number {
    return this.y - MARGIN_BOTTOM;
  }

  ensureSpace(requiredHeight: number): boolean {
    if (this.availableHeight() >= requiredHeight) return false;
    this.addPage();
    return true;
  }

  drawSectionKicker(title: string) {
    const kickerSize = 7;
    const baselineY = this.y - kickerSize;
    drawTrackedText(
      this.page,
      title,
      MARGIN_X,
      baselineY,
      this.fonts.sansMedium,
      kickerSize,
      0.7,
      COLOR_INK_3
    );
    this.y = baselineY - 8.5;
  }

  drawLinkLabel(
    label: string,
    uri: string,
    x: number,
    y: number,
    font: PDFFont,
    size: number,
    color: Color,
    options?: { withArrow?: boolean; arrowColor?: Color }
  ): number {
    const safeLabel = cleanText(label);
    const withArrow = options?.withArrow ?? false;
    const arrowGap = 3.2;
    const arrowSize = size * 0.62;

    this.page.drawText(safeLabel, { x, y, size, font, color });
    const textWidth = font.widthOfTextAtSize(safeLabel, size);
    let totalWidth = textWidth;

    if (withArrow) {
      drawArrowUpRight(
        this.page,
        x + textWidth + arrowGap,
        y,
        arrowSize,
        options?.arrowColor ?? color
      );
      totalWidth += arrowGap + arrowSize;
    }

    addUriLink(this.doc, this.page, x - 1, y - 3, totalWidth + 2, size + 5, uri);
    return totalWidth;
  }

  /**
   * Renders a section as one or more Kertas white rounded cards (`cardGroup`),
   * automatically slicing complete entries cleanly across pages with matching
   * continuation headers and never splitting an entry across a page break.
   */
  drawCardSection(
    title: string,
    continuationTitle: string,
    entries: CardEntryBlock[],
    options?: { keepTogetherIfFitsPage?: boolean; sectionBottomGap?: number }
  ) {
    const kickerBlockHeight = 15.5;
    const fullPageHeight = PAGE_HEIGHT - MARGIN_TOP - MARGIN_BOTTOM;
    const totalEntriesHeight = entries.reduce((sum, e) => sum + e.height, 0);

    if (
      options?.keepTogetherIfFitsPage &&
      kickerBlockHeight + totalEntriesHeight > this.availableHeight() &&
      kickerBlockHeight + totalEntriesHeight <= fullPageHeight
    ) {
      this.addPage();
    }

    let cursorIndex = 0;
    let sliceIndex = 0;

    while (cursorIndex < entries.length) {
      const firstEntry = entries[cursorIndex];
      if (kickerBlockHeight + firstEntry.height > this.availableHeight()) {
        this.addPage();
      }

      const sectionLabel = sliceIndex === 0 ? title : continuationTitle;
      this.drawSectionKicker(sectionLabel);

      const slice: CardEntryBlock[] = [];
      let sliceHeight = 0;
      const maxCardHeight = this.availableHeight();

      while (cursorIndex < entries.length) {
        const nextEntry = entries[cursorIndex];
        if (slice.length > 0 && sliceHeight + nextEntry.height > maxCardHeight) {
          break;
        }
        slice.push(nextEntry);
        sliceHeight += nextEntry.height;
        cursorIndex += 1;
      }

      const cardTopY = this.y;
      const cardBottomY = cardTopY - sliceHeight;
      drawRoundedCard(
        this.page,
        MARGIN_X,
        cardBottomY,
        CONTENT_WIDTH,
        sliceHeight,
        CARD_RADIUS
      );

      let entryTopY = cardTopY;
      slice.forEach((entry, index) => {
        entry.draw(this.page, entryTopY);
        entryTopY -= entry.height;
        if (index < slice.length - 1) {
          this.page.drawLine({
            start: { x: MARGIN_X + 0.5, y: entryTopY },
            end: { x: MARGIN_X + CONTENT_WIDTH - 0.5, y: entryTopY },
            thickness: 0.6,
            color: COLOR_RULE,
          });
        }
      });

      this.y = cardBottomY - (options?.sectionBottomGap ?? 18);
      sliceIndex += 1;
    }
  }

  finalizeFooters() {
    const total = this.pages.length;
    const leftText = cleanText(
      `${RESUME_CONTACT.name} · ${RESUME_CONTACT.title} · ${RESUME_CONTACT.websiteDisplay}`
    );

    this.pages.forEach((page, index) => {
      page.drawLine({
        start: { x: MARGIN_X, y: FOOTER_RULE_Y },
        end: { x: PAGE_WIDTH - MARGIN_X, y: FOOTER_RULE_Y },
        thickness: 0.55,
        color: COLOR_RULE,
      });

      page.drawText(leftText, {
        x: MARGIN_X,
        y: FOOTER_TEXT_Y,
        size: 7.5,
        font: this.fonts.sans,
        color: COLOR_INK_3,
      });

      const pageLabel = `Page ${index + 1} of ${total}`;
      const labelWidth = this.fonts.sans.widthOfTextAtSize(pageLabel, 7.5);
      page.drawText(pageLabel, {
        x: PAGE_WIDTH - MARGIN_X - labelWidth,
        y: FOOTER_TEXT_Y,
        size: 7.5,
        font: this.fonts.sans,
        color: COLOR_INK_3,
      });
    });
  }
}

function drawMasthead(composer: A4Composer) {
  const { page, fonts } = composer;
  let y = composer.y;

  // Kicker matching /resume masthead
  const kickerSize = 7;
  y -= kickerSize;
  drawTrackedText(
    page,
    RESUME_CONTACT.location.toUpperCase(),
    MARGIN_X,
    y,
    fonts.sansMedium,
    kickerSize,
    0.7,
    COLOR_INK_3
  );

  // Name in Caudex Bold
  y -= 28;
  page.drawText(cleanText(RESUME_CONTACT.name), {
    x: MARGIN_X,
    y,
    size: 27,
    font: fonts.serifBold,
    color: COLOR_INK,
  });

  // Subtitle in Caudex Italic
  y -= 19;
  const subtitleLines = wrapLines(
    `${RESUME_CONTACT.title} · ${RESUME_CONTACT.subtitle}`,
    fonts.serifItalic,
    12,
    CONTENT_WIDTH
  );
  y = drawWrappedBlock(
    page,
    subtitleLines,
    MARGIN_X,
    y,
    fonts.serifItalic,
    12,
    15,
    COLOR_INK_2
  );

  // Contact strip bordered top & bottom like /resume
  const stripTopY = y + 3;
  page.drawLine({
    start: { x: MARGIN_X, y: stripTopY },
    end: { x: PAGE_WIDTH - MARGIN_X, y: stripTopY },
    thickness: 0.65,
    color: COLOR_RULE,
  });

  const contactSize = 8.4;
  const contactBaselineY = stripTopY - 14.5;
  const leftContacts = [
    {
      label: RESUME_CONTACT.email,
      uri: `mailto:${RESUME_CONTACT.email}`,
      external: false,
    },
    {
      label: RESUME_CONTACT.phone,
      uri: RESUME_CONTACT.phoneHref,
      external: false,
    },
    {
      label: "GitHub",
      uri: RESUME_CONTACT.github,
      external: true,
    },
    {
      label: "LinkedIn",
      uri: RESUME_CONTACT.linkedin,
      external: true,
    },
  ];

  let cursorX = MARGIN_X;
  for (const item of leftContacts) {
    const width = composer.drawLinkLabel(
      item.label,
      item.uri,
      cursorX,
      contactBaselineY,
      fonts.sans,
      contactSize,
      COLOR_INK_2,
      { withArrow: item.external, arrowColor: COLOR_INK_3 }
    );
    cursorX += width + 14;
  }

  // Right-aligned portfolio URL where the action button sits on /resume
  const siteArrowSpace = 3.2 + contactSize * 0.62;
  const siteTextWidth = fonts.sans.widthOfTextAtSize(
    RESUME_CONTACT.websiteDisplay,
    contactSize
  );
  composer.drawLinkLabel(
    RESUME_CONTACT.websiteDisplay,
    RESUME_CONTACT.website,
    PAGE_WIDTH - MARGIN_X - siteTextWidth - siteArrowSpace,
    contactBaselineY,
    fonts.sans,
    contactSize,
    COLOR_INK_3,
    { withArrow: true, arrowColor: COLOR_INK_3 }
  );

  const stripBottomY = contactBaselineY - 8.5;
  page.drawLine({
    start: { x: MARGIN_X, y: stripBottomY },
    end: { x: PAGE_WIDTH - MARGIN_X, y: stripBottomY },
    thickness: 0.65,
    color: COLOR_RULE,
  });

  composer.y = stripBottomY - 18;
}

function drawSummarySection(composer: A4Composer) {
  const fontSize = 9.35;
  const lineHeight = 14.2;
  const paragraphGap = 8;

  const preparedParagraphs = RESUME_SUMMARY.map((paragraph) =>
    wrapLines(paragraph, composer.fonts.sans, fontSize, CONTENT_WIDTH)
  );

  // Move to first line baseline
  composer.y -= fontSize;

  preparedParagraphs.forEach((lines, index) => {
    composer.y = drawWrappedBlock(
      composer.page,
      lines,
      MARGIN_X,
      composer.y,
      composer.fonts.sans,
      fontSize,
      lineHeight,
      COLOR_INK_2
    );
    if (index < preparedParagraphs.length - 1) {
      composer.y -= paragraphGap;
    }
  });

  // Restore y from next-baseline back to exact bottom + section gap
  composer.y += lineHeight - fontSize;
  composer.y -= 19;
}

function buildExperienceEntries(composer: A4Composer): CardEntryBlock[] {
  const { fonts } = composer;
  const padTop = 12;
  const padBottom = 12;
  const companySize = 11.4;
  const periodSize = 8;
  const roleSize = 8.75;
  const bulletSize = 8.7;
  const bulletLineHeight = 12.8;
  const bulletIndent = 11.5;
  const bulletGap = 3.5;
  const bulletWidth = CARD_INNER_WIDTH - bulletIndent;

  return EXPERIENCES.map((exp) => {
    const wrappedBullets = exp.description.map((bullet) =>
      wrapLines(bullet, fonts.sans, bulletSize, bulletWidth)
    );
    const nonEmptyBullets = wrappedBullets.filter((lines) => lines.length > 0);
    const totalBulletLines = nonEmptyBullets.reduce(
      (sum, lines) => sum + lines.length,
      0
    );

    const headerToRole = 14;
    const roleToBullets = 13.5;
    const bulletsHeight =
      totalBulletLines > 0
        ? (totalBulletLines - 1) * bulletLineHeight +
          Math.max(0, nonEmptyBullets.length - 1) * bulletGap +
          bulletSize * 0.35
        : 0;

    const height =
      padTop +
      companySize * 0.82 +
      headerToRole +
      roleToBullets +
      bulletsHeight +
      padBottom;

    return {
      height,
      draw(page: PDFPage, topY: number) {
        const innerX = MARGIN_X + CARD_PAD_X;
        const innerRightX = MARGIN_X + CONTENT_WIDTH - CARD_PAD_X;

        // Row 1: Company (Caudex Bold) + Period (Jost Medium right-aligned)
        const companyY = topY - padTop - companySize * 0.82;
        page.drawText(cleanText(exp.company), {
          x: innerX,
          y: companyY,
          size: companySize,
          font: fonts.serifBold,
          color: COLOR_INK,
        });

        const period = cleanText(exp.period);
        const periodWidth = fonts.sansMedium.widthOfTextAtSize(
          period,
          periodSize
        );
        page.drawText(period, {
          x: innerRightX - periodWidth,
          y: companyY + 1,
          size: periodSize,
          font: fonts.sansMedium,
          color: COLOR_INK_3,
        });

        // Row 2: Role (Jost Medium --dakwat-2) · Domain (Jost Regular --dakwat-3)
        const roleY = companyY - headerToRole;
        const rolePart = cleanText(exp.role);
        const domainPart = ` · ${cleanText(exp.domain)}`;

        page.drawText(rolePart, {
          x: innerX,
          y: roleY,
          size: roleSize,
          font: fonts.sansMedium,
          color: COLOR_INK_2,
        });

        const roleWidth = fonts.sansMedium.widthOfTextAtSize(rolePart, roleSize);
        page.drawText(domainPart, {
          x: innerX + roleWidth,
          y: roleY,
          size: roleSize,
          font: fonts.sans,
          color: COLOR_INK_3,
        });

        // Row 3: Hairline dash bullet list
        const bulletsStartY = roleY - roleToBullets;
        drawDashBullets(
          page,
          nonEmptyBullets,
          innerX,
          bulletsStartY,
          fonts.sans,
          bulletSize,
          bulletLineHeight,
          bulletIndent,
          bulletGap
        );
      },
    };
  });
}

function buildSkillEntries(composer: A4Composer): CardEntryBlock[] {
  const { fonts } = composer;
  const padTop = 10.5;
  const padBottom = 10.5;
  const categorySize = 6.8;
  const categoryTracking = 0.65;
  const listSize = 8.75;
  const listLineHeight = 13;

  return SKILL_GROUPS.map((group) => {
    const category = cleanText(group.category);
    const lines = wrapLines(group.skills, fonts.sans, listSize, CARD_INNER_WIDTH);
    const categoryToList = 12;
    const listHeight =
      lines.length > 0
        ? (lines.length - 1) * listLineHeight + listSize * 0.35
        : 0;

    const height =
      padTop + categorySize * 0.85 + categoryToList + listHeight + padBottom;

    return {
      height,
      draw(page: PDFPage, topY: number) {
        const innerX = MARGIN_X + CARD_PAD_X;
        const categoryY = topY - padTop - categorySize * 0.85;

        drawTrackedText(
          page,
          category,
          innerX,
          categoryY,
          fonts.sansMedium,
          categorySize,
          categoryTracking,
          COLOR_INK_3
        );

        drawWrappedBlock(
          page,
          lines,
          innerX,
          categoryY - categoryToList,
          fonts.sans,
          listSize,
          listLineHeight,
          COLOR_INK
        );
      },
    };
  });
}

function buildProjectEntries(composer: A4Composer): CardEntryBlock[] {
  const { fonts } = composer;
  const padTop = 11.5;
  const padBottom = 11.5;
  const nameSize = 11.4;
  const linkSize = 8;
  const bulletSize = 8.7;
  const bulletLineHeight = 12.8;
  const bulletIndent = 11.5;
  const bulletGap = 3.2;
  const bulletWidth = CARD_INNER_WIDTH - bulletIndent;

  return PROJECTS.map((project) => {
    const wrappedBullets = project.bullets.map((bullet) =>
      wrapLines(bullet, fonts.sans, bulletSize, bulletWidth)
    );
    const nonEmptyBullets = wrappedBullets.filter((lines) => lines.length > 0);
    const totalBulletLines = nonEmptyBullets.reduce(
      (sum, lines) => sum + lines.length,
      0
    );

    const headerToBullets = 14;
    const bulletsHeight =
      totalBulletLines > 0
        ? (totalBulletLines - 1) * bulletLineHeight +
          Math.max(0, nonEmptyBullets.length - 1) * bulletGap +
          bulletSize * 0.35
        : 0;

    const height =
      padTop + nameSize * 0.82 + headerToBullets + bulletsHeight + padBottom;

    return {
      height,
      draw(page: PDFPage, topY: number) {
        const innerX = MARGIN_X + CARD_PAD_X;
        const innerRightX = MARGIN_X + CONTENT_WIDTH - CARD_PAD_X;
        const titleY = topY - padTop - nameSize * 0.82;

        page.drawText(cleanText(project.name), {
          x: innerX,
          y: titleY,
          size: nameSize,
          font: fonts.serifBold,
          color: COLOR_INK,
        });

        const arrowExtra = 3.2 + linkSize * 0.62;
        const linkGap = 11;
        const primaryLabel = cleanText(project.displayUrl);
        const primaryWidth =
          fonts.sans.widthOfTextAtSize(primaryLabel, linkSize) + arrowExtra;
        const secLabel = project.secondaryLink
          ? cleanText(project.secondaryLink.label)
          : null;
        const secWidth = secLabel
          ? fonts.sans.widthOfTextAtSize(secLabel, linkSize) + arrowExtra
          : 0;

        const totalLinksWidth =
          primaryWidth + (secLabel ? linkGap + secWidth : 0);
        const primaryX = innerRightX - totalLinksWidth;

        // Draw primary link then secondary link left-to-right for natural ATS/reading order
        composer.drawLinkLabel(
          primaryLabel,
          project.href,
          primaryX,
          titleY + 1,
          fonts.sans,
          linkSize,
          COLOR_INK_2,
          { withArrow: true, arrowColor: COLOR_INK_3 }
        );

        if (secLabel && project.secondaryLink) {
          composer.drawLinkLabel(
            secLabel,
            project.secondaryLink.href,
            primaryX + primaryWidth + linkGap,
            titleY + 1,
            fonts.sans,
            linkSize,
            COLOR_INK_2,
            { withArrow: true, arrowColor: COLOR_INK_3 }
          );
        }

        drawDashBullets(
          page,
          nonEmptyBullets,
          innerX,
          titleY - headerToBullets,
          fonts.sans,
          bulletSize,
          bulletLineHeight,
          bulletIndent,
          bulletGap
        );
      },
    };
  });
}

/**
 * Generates an ISO A4 (210mm x 297mm) Kertas & Dakwat editorial PDF directly from
 * `src/data/experience.ts`, matching the `/resume` UI with embedded Caudex & Jost fonts,
 * warm paper ground, rounded white ledger cards, clickable URI annotations, and clean
 * ATS text extraction.
 */
export async function buildResumeA4Pdf(): Promise<Uint8Array> {
  const doc = await PDFDocument.create();
  doc.registerFontkit(fontkit);

  const now = new Date();
  doc.setTitle(`${RESUME_CONTACT.name} - Resume`);
  doc.setAuthor(RESUME_CONTACT.name);
  doc.setSubject(`${RESUME_CONTACT.title} - Resume (ISO A4)`);
  doc.setKeywords([
    "Yu Hang Ang",
    "Senior Software Engineer",
    "Flutter",
    "Next.js",
    "Golang",
    "Mobile Architecture",
    "Curriculum Vitae",
    "Resume",
  ]);
  doc.setCreator("yuhangang.com");
  doc.setProducer("pdf-lib");
  doc.setCreationDate(now);
  doc.setModificationDate(now);

  const buffers = await loadFontBuffers();
  // Keep full Caudex tables (subsetting drops composite glyphs in @pdf-lib/fontkit);
  // subset Jost cleanly to keep the generated PDF lightweight.
  const fonts: FontPack = {
    serifBold: await doc.embedFont(buffers.caudexBold, { subset: false }),
    serifItalic: await doc.embedFont(buffers.caudexItalic, { subset: false }),
    sans: await doc.embedFont(buffers.jostRegular, { subset: true }),
    sansMedium: await doc.embedFont(buffers.jostMedium, { subset: true }),
  };

  const composer = new A4Composer(doc, fonts);
  drawMasthead(composer);
  drawSummarySection(composer);

  composer.drawCardSection(
    "01 · EXPERIENCE",
    "01 · EXPERIENCE · CONTINUED",
    buildExperienceEntries(composer),
    { sectionBottomGap: 18 }
  );

  composer.drawCardSection(
    "02 · SKILLS & STACK",
    "02 · SKILLS & STACK · CONTINUED",
    buildSkillEntries(composer),
    { keepTogetherIfFitsPage: true, sectionBottomGap: 18 }
  );

  composer.drawCardSection(
    "03 · SELECTED PROJECTS",
    "03 · SELECTED PROJECTS · CONTINUED",
    buildProjectEntries(composer),
    { keepTogetherIfFitsPage: true, sectionBottomGap: 14 }
  );

  composer.finalizeFooters();

  // Disable object streams for maximum compatibility with PDF viewers and ATS parsers
  return doc.save({ useObjectStreams: false });
}
