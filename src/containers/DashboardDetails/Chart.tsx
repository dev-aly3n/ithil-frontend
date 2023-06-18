import { GridItem, useColorMode } from "@chakra-ui/react";

import CustomChart from "@/components/chart";
import fakeChartData from "@/data/fakeData.json";
import { palette } from "@/styles/theme/palette";
import { formatDate } from "@/utils/date.utils";
import { pickColor } from "@/utils/theme";

interface GraphDataPoint {
  date: string;
  tvl: number | string;
}

const graphData = fakeChartData.data.map<GraphDataPoint>((item, key) => ({
  date: formatDate(new Date(item.timestamp)),
  tvl: item.tvlUsd,
}));

const Chart = () => {
  const { colorMode } = useColorMode();

  return (
    <GridItem
      borderRadius={["12px"]}
      paddingX={{
        base: "20px",
        md: "30px",
        lg: "40px",
      }}
      paddingY={{
        base: "20px",
        md: "30px",
        lg: "40px",
      }}
      bg={pickColor(colorMode, palette.colors.primary, "100")}
      area="main"
    >
      <CustomChart data={graphData} xKey="date" yKey="tvl" dataKey="tvl" />
    </GridItem>
  );
};
export default Chart;
