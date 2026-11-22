import { ArrowUpRight, FileText } from "lucide-react";
import styles from "./ExportPdfButton.module.scss";

export default function ExportPdfButton() {
  return (
    <a
      href="/resume/pdf"
      target="_blank"
      rel="noopener noreferrer"
      className={styles.exportBtn}
      aria-label="Open resume as ISO A4 PDF in browser"
    >
      <FileText size={14} strokeWidth={1.85} aria-hidden="true" />
      <span>View A4 PDF</span>
      <ArrowUpRight size={13} strokeWidth={1.75} aria-hidden="true" />
    </a>
  );
}
