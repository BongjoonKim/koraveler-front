import {searchInfoQueryAtom} from "../../../../stores/jotai/jotai";
import {useNavigate} from "react-router-dom";
import {AnimatePresence, motion} from "framer-motion";
import {Box, HStack, Spinner, Tag, Text, VStack} from "@chakra-ui/react";
import {replacingHtmlInText} from "../../../../utils/commonUtils";
import {Calendar, ChevronRight, Clock, MapPin} from "lucide-react";
import {useAtomValue} from "jotai";
import {preferredLocaleAtom, resolveLocale} from "../../../../stores/jotai/localeAtom";
import {useCurrentUser} from "../../../../hooks/useCurrentUser";

interface SearchDropdownProps {
  documents: DocumentDTO[];
  isLoading: boolean;
  isOpen: boolean;
  onClose: () => void;
  searchInfoQuery?: string;
}

function SearchDropdown({
                          documents,
                          isLoading,
                          isOpen,
                          onClose,
                          searchInfoQuery
                        }: SearchDropdownProps) {
  const navigate = useNavigate();
  const preferredLocale = useAtomValue(preferredLocaleAtom);
  const { data: currentUser } = useCurrentUser();
  const activeLocale = resolveLocale(null, preferredLocale, !!currentUser?.id);

  const handleDocumentClick = (docId : string) => {
    navigate(`/blog/view/${activeLocale}/${docId}`);
    onClose();
  }
  
  const getHighlightedText = (text?: string, highlight?: string) => {
    if (!text || !highlight) return;
    if (!highlight.trim()) {
      return text;
    }
    const parts = text.split(new RegExp(`(${highlight})`, "gi"));
    return (
      <>
        {parts.map((part, index) =>
          part.toLowerCase() === highlight.toLowerCase() ? (
            <mark key={index} style={{ backgroundColor: "#fbbf24", padding: "2px" }}>
              {part}
            </mark>
          ) : (
            part
          )
        )}
      </>
    );
  };
  
  return (
    // 애니메이션 설정
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          style={{
            position: "absolute",
            top: "calc(100% + 10px)",
            left: 0,
            right: 0,
            zIndex: 50,
          }}
        >
          <Box
            bg="white"
            borderRadius="2xl"
            boxShadow="0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
            overflow="hidden"
            maxHeight="400px"
            style={{
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(255, 255, 255, 0.8)",
            }}
          >
            {/* Loading State */}
            {isLoading && (
              <Box p={6} textAlign="center">
                <Spinner size="md" color="indigo.500" />
                <Text mt={3} color="gray.500" fontSize="sm">
                  Searching for "{searchInfoQuery}"...
                </Text>
              </Box>
            )}
            
            {/* Results */}
            {!isLoading && documents.length > 0 && (
              <VStack gap={0} align="stretch" p={2}>
                <Box px={4} py={2} borderBottom="1px solid" borderColor="gray.100">
                  <Text fontSize="xs" color="gray.500" fontWeight="semibold" textTransform="uppercase">
                    Search Results
                  </Text>
                </Box>
                
                {documents.map((doc) => (
                  <Box
                    key={doc.id}
                    as={motion.div}
                    onClick={() => handleDocumentClick(doc.id!)}
                    cursor="pointer"
                    p={4}
                    borderBottom="1px solid"
                    borderColor="gray.50"
                    position="relative"
                    role="button"
                    tabIndex={0}
                    _hover={{
                      "& .arrow-icon": {
                        transform: "translateX(4px)",
                      }
                    }}
                  >
                    <HStack justify="space-between" align="start">
                      <Box flex={1}>
                        {/* Title with highlight */}
                        <Text
                          fontWeight="bold"
                          fontSize="md"
                          color="gray.800"
                          mb={1}
                        >
                          {getHighlightedText(doc?.title, searchInfoQuery)}
                        </Text>
                        
                        {/* Content preview */}
                        <Text
                          fontSize="sm"
                          color="gray.600"
                          mb={2}
                        >
                          {getHighlightedText(
                            replacingHtmlInText(doc.contents),
                            searchInfoQuery
                          )}
                        </Text>
                        
                        {/* Meta info */}
                        <HStack gap={4} fontSize="xs" color="gray.500">
                          {/*{doc.location && (*/}
                          {/*  <HStack spacing={1}>*/}
                          {/*    <MapPin size={12} />*/}
                          {/*    <Text>{doc.location}</Text>*/}
                          {/*  </HStack>*/}
                          {/*)}*/}
                          {doc.created && (
                            <HStack gap={1}>
                              <Calendar size={12} />
                              <Text>{new Date(doc.created).toLocaleDateString()}</Text>
                            </HStack>
                          )}
                          {/*{doc.readTime && (*/}
                          {/*  <HStack spacing={1}>*/}
                          {/*    <Clock size={12} />*/}
                          {/*    <Text>{doc.readTime} min read</Text>*/}
                          {/*  </HStack>*/}
                          {/*)}*/}
                        </HStack>
                        
                        {/* Tags */}
                        {/*{doc.tags && doc.tags.length > 0 && (*/}
                        {/*  <HStack mt={2} gap={2}>*/}
                        {/*    {doc.tags.slice(0, 3).map((tag) => (*/}
                        {/*      <Tag*/}
                        {/*        key={tag}*/}
                        {/*        size="sm"*/}
                        {/*        colorScheme="indigo"*/}
                        {/*        // variant="subtle"*/}
                        {/*      >*/}
                        {/*        {tag}*/}
                        {/*      </Tag>*/}
                        {/*    ))}*/}
                        {/*  </HStack>*/}
                        {/*)}*/}
                      </Box>
                      
                      {/* Arrow icon */}
                      <Box
                        className="arrow-icon"
                        color="gray.400"
                        transition="transform 0.2s"
                      >
                        <ChevronRight size={20} />
                      </Box>
                    </HStack>
                  </Box>
                ))}
                
                {/* View all results link */}
                <Box
                  p={3}
                  bg="gray.50"
                  textAlign="center"
                  cursor="pointer"
                  onClick={() => navigate(`/search?q=${encodeURIComponent(searchInfoQuery || "")}`)}
                  _hover={{ bg: "gray.100" }}
                >
                  <Text fontSize="sm" color="indigo.600" fontWeight="medium">
                    View all results for "{searchInfoQuery}"
                  </Text>
                </Box>
              </VStack>
            )}
            
            {/* No results */}
            {!isLoading && documents.length === 0 && Number(searchInfoQuery?.length) >= 2 && (
              <Box p={6} textAlign="center">
                <Text color="gray.500" fontSize="sm" mb={2}>
                  No results found for "{searchInfoQuery}"
                </Text>
                <Text color="gray.400" fontSize="xs">
                  Try different keywords or check your spelling
                </Text>
              </Box>
            )}
          </Box>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default SearchDropdown;