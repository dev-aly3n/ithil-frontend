import { Box, GridItem, HStack, Text, useColorMode } from "@chakra-ui/react";
import Link from "next/link";

import { ArrowLeft } from "@/assets/svgs";
import TokenIcon from "@/components/TokenIcon";
import { palette } from "@/styles/theme/palette";
import { pickColor } from "@/utils/theme";

const Header = () => {
  const { colorMode } = useColorMode();
  return (
    <GridItem
      bg={pickColor(colorMode, palette.colors.primary, "100")}
      area="header"
      borderRadius={"12px"}
      paddingX={{
        base: "20px",
        md: "30px",
        lg: "40px",
      }}
      paddingY={{
        base: "17px",
        md: "27px",
      }}
    >
      <HStack
        spacing={{
          base: "10px",
          md: "15px",
        }}
      >
        <Link href="/dashboard">
          <ArrowLeft
            className={`${colorMode === "light" && "fill-[#070b0f]"}`}
          />
        </Link>
        <HStack
          spacing={{
            base: "10px",
            md: "15px",
          }}
        >
          <Box position="relative" display="inline-block" mr="50px">
            <Box
              position="absolute"
              left="0"
              top="50%"
              transform="translateY(-50%)"
            >
              <TokenIcon name="USDT" />
            </Box>
            <Box
              position="absolute"
              left="15px"
              top="50%"
              transform="translateY(-50%)"
            >
              <TokenIcon
                style={{
                  border:
                    colorMode === "light"
                      ? "2.5px solid #f2f5f6"
                      : "2.5px solid #151a29",
                  borderRadius: "100%",
                }}
                width={42}
                height={42}
                name="DAI"
              />
            </Box>
          </Box>
          <Text fontSize="24px" fontWeight="bold" lineHeight="22px">
            ETH / BNB
          </Text>
        </HStack>
      </HStack>
    </GridItem>
  );
};

export default Header;