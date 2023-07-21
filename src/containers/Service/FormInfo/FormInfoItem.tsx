import { SkeletonText, Text } from "@chakra-ui/react";

import { useColorMode } from "@/hooks/useColorMode";

export interface Props {
  label: string;
  value?: string | number;
  extension: string;
  isLoading?: boolean;
}

const FormInfoItem: React.FC<Props> = ({
  extension,
  label,
  value,
  isLoading = false,
}) => {
  const { mode } = useColorMode();

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "5px 5px 5px 15px",
        }}
      >
        <Text
          style={{
            fontSize: "14px",
            fontWeight: "400",
            lineHeight: "24px",
          }}
          color={mode("primary.200.dark", "primary.700.dark")}
        >
          {label}
        </Text>
        {isLoading ? (
          <SkeletonText noOfLines={1} width={50} />
        ) : (
          <Text
            style={{
              fontSize: "14px",
              fontWeight: "500",
              lineHeight: "24px",
            }}
          >
            <span>{value}</span>
            <span>{extension}</span>
          </Text>
        )}
      </div>
    </>
  );
};

export default FormInfoItem;
