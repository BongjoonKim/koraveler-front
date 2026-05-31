import {searchInfoQueryAtom} from "../../../../stores/jotai/jotai";
import {useNavigate} from "react-router-dom";
import {AnimatePresence, motion} from "framer-motion";
import {Box, HStack, Spinner, Tag, Text, VStack} from "@chakra-ui/react";
import {replacingHtmlInText} from "../../../../utils/commonUtils";
import {Calendar, ChevronRight, Clock, MapPin} from "lucide-react";
import {useAtomValue} from "jotai";
import {preferredLocaleAtom, resolveLocale} from "../../../../stores/jotai/localeAtom";
import {useCurrentUser} from "../../../../hooks/useCurrentUser";
import {RefObject, useEffect, useLayoutEffect, useState} from "react";
import {createPortal} from "react-dom";

interface SearchDropdownProps {
  documents: DocumentDTO[];
  isLoading: boolean;
  isOpen: boolean;
  onClose: () => void;
  searchInfoQuery?: string;
  // 부모의 overflow:hidden 을 벗어나기 위한 portal 모드.
  // anchorRef 를 넘겨주면 그 엘리먼트 바로 아래로 fixed 위치를 잡아 document.body 에 portal 한다.
  anchorRef?: RefObject<HTMLElement | null>;
}

function SearchDropdown({
                          documents,
                          isLoading,
                          isOpen,
                          onClose,
                          searchInfoQuery,
                          anchorRef,
                        }: SearchDropdownProps) {
  const navigate = useNavigate();
  const preferredLocale = useAtomValue(preferredLocaleAtom);
  const { data: currentUser } = useCurrentUser();
  const activeLocale = resolveLocale(null, preferredLocale, !!currentUser?.id);

  const handleDocumentClick = (docId : string) => {
    navigate(`/blog/view/${activeLocale}/${docId}`);
    onClose();
  }

  // portal 모드일 때 anchor 의 화면상 좌표를 추적
  const [anchorRect, setAnchorRect] = useState<{ top: number; left: number; width: number } | null>(null);

  useLayoutEffect(() => {
    if (!anchorRef?.current || !isOpen) return;
    const update = () => {
      const el = anchorRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      setAnchorRect({ top: r.bottom + 10, left: r.left, width: r.width });
    };
    update();
    window.addEventListener("resize", update);
    window.addEventListener("scroll", update, true);
    return () => {
      window.removeEventListener("resize", update);
      window.removeEventListener("scroll", update, true);
    };
  }, [anchorRef, isOpen]);
  
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
            <mark key={index} style={{ backgroundColor: "rgba(143,191,148,0.28)", color: "#bcd0bb", padding: "0 2px", borderRadius: "2px" }}>
              {part}
            </mark>
          ) : (
            part
          )
        )}
      </>
    );
  };
  
  const usePortal = !!anchorRef;
  const portalStyle: React.CSSProperties = anchorRect
    ? {
        position: "fixed",
        top: anchorRect.top,
        left: anchorRect.left,
        width: anchorRect.width,
        zIndex: 1000,
      }
    : { position: "fixed", top: -9999, left: -9999, zIndex: 1000 };

  const tree = (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          data-search-dropdown=""
          initial={{ y: -6 }}
          animate={{ y: 0 }}
          exit={{ y: -6 }}
          transition={{ duration: 0.18 }}
          style={
            usePortal
              ? portalStyle
              : {
                  position: "absolute",
                  top: "calc(100% + 10px)",
                  left: 0,
                  right: 0,
                  zIndex: 50,
                }
          }
        >
          <Box
            bg="#141714"
            borderRadius="14px"
            boxShadow="0 20px 25px -5px rgba(0, 0, 0, 0.55), 0 10px 10px -5px rgba(0, 0, 0, 0.3)"
            overflow="hidden auto"
            maxHeight="400px"
            style={{
              backdropFilter: "blur(10px)",
              border: "0.5px solid rgba(255, 255, 255, 0.18)",
            }}
          >
            {/* Loading State */}
            {isLoading && (
              <Box p={6} textAlign="center">
                <Spinner size="md" color="#8fbf94" />
                <Text mt={3} color="#9aa399" fontSize="sm">
                  Searching for "{searchInfoQuery}"...
                </Text>
              </Box>
            )}

            {/* Results */}
            {!isLoading && documents.length > 0 && (
              <VStack gap={0} align="stretch" p={2}>
                <Box px={4} py={2} borderBottom="0.5px solid" borderColor="rgba(255,255,255,0.08)">
                  <Text fontSize="xs" color="#7e857d" fontWeight="medium" letterSpacing="0.12em" textTransform="uppercase">
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
                    borderBottom="0.5px solid"
                    borderColor="rgba(255,255,255,0.06)"
                    position="relative"
                    role="button"
                    tabIndex={0}
                    _hover={{
                      bg: "rgba(255,255,255,0.04)",
                      "& .arrow-icon": {
                        transform: "translateX(4px)",
                        color: "#8fbf94",
                      }
                    }}
                  >
                    <HStack justify="space-between" align="start">
                      <Box flex={1}>
                        {/* Title with highlight */}
                        <Text
                          fontWeight="medium"
                          fontSize="md"
                          color="#f3f4f1"
                          mb={1}
                          fontFamily="'Noto Serif KR', Georgia, serif"
                        >
                          {getHighlightedText(doc?.title, searchInfoQuery)}
                        </Text>

                        {/* Content preview */}
                        <Text
                          fontSize="sm"
                          color="#9aa399"
                          mb={2}
                          lineClamp={2}
                        >
                          {getHighlightedText(
                            replacingHtmlInText(doc.contents),
                            searchInfoQuery
                          )}
                        </Text>

                        {/* Meta info */}
                        <HStack gap={4} fontSize="xs" color="#7e857d">
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
                        color="#7e857d"
                        transition="transform 0.2s, color 0.2s"
                      >
                        <ChevronRight size={20} />
                      </Box>
                    </HStack>
                  </Box>
                ))}

                {/* View all results link */}
                <Box
                  p={3}
                  bg="rgba(255,255,255,0.03)"
                  textAlign="center"
                  cursor="pointer"
                  onClick={() => navigate(`/search?q=${encodeURIComponent(searchInfoQuery || "")}`)}
                  _hover={{ bg: "rgba(255,255,255,0.06)" }}
                >
                  <Text fontSize="sm" color="#8fbf94" fontWeight="medium">
                    View all results for "{searchInfoQuery}"
                  </Text>
                </Box>
              </VStack>
            )}

            {/* No results */}
            {!isLoading && documents.length === 0 && Number(searchInfoQuery?.length) >= 2 && (
              <Box p={6} textAlign="center">
                <Text color="#cdd6c5" fontSize="sm" mb={2}>
                  No results found for "{searchInfoQuery}"
                </Text>
                <Text color="#7e857d" fontSize="xs">
                  Try different keywords or check your spelling
                </Text>
              </Box>
            )}
          </Box>
        </motion.div>
      )}
    </AnimatePresence>
  );

  if (usePortal && typeof document !== "undefined") {
    return createPortal(tree, document.body);
  }
  return tree;
}

export default SearchDropdown;