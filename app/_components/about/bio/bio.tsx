import React from "react";
import Image from "next/image";
import { Spacer } from "../../common/layout/center";
import {
  AvatarContainer,
  AvatarWrapper,
  BioText,
  Description,
  Name,
} from "./bio.style";

interface BioProps {
  src: string;
  name: string;
  description: string | JSX.Element;
}

const Bio: React.FC<BioProps> = ({ src, name, description }) => {
  return (
    <AvatarContainer>
      <AvatarWrapper size={"large"} variant={"circle"}>
        {
          <Image
            src={src}
            alt={name || "avatar"}
            width={200}
            height={200}
            style={{ objectFit: "cover" }}
          />
        }
      </AvatarWrapper>
      <Spacer size={32} />
      <BioText>
        <Name>{name}</Name>
        <Description>{description}</Description>
      </BioText>
    </AvatarContainer>
  );
};

export default Bio;
