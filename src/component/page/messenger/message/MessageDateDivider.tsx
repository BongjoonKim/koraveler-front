import {Box, HStack, Separator, Text} from "@chakra-ui/react";
import moment from "moment";
import {Divide} from "lucide-react";

interface MessageDateDividerProps {
  date : string;
}
export default function MessageDateDivider({date} : MessageDateDividerProps) {
  const formatted = new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
  
  
  return (
    <HStack my={4} align="center" w={"100%"} display={"flex"} justifyContent={"center"}>
      <Text
        fontSize="sm"
        style={{ color: "#94a3a0" }}
        whiteSpace="nowrap"
      >
        {formatted}
      </Text>
    </HStack>
  )
}