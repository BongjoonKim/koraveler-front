import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  Box,
  Card,
  Text,
  HStack,
  VStack,
  Textarea,
  Tabs,
  Badge,
  Select,
  createListCollection,
  IconButton,
  Separator,
  Stack
} from "@chakra-ui/react";
import {
  Languages,
  ArrowRightLeft,
  Volume2,
  Copy,
  Mic,
  Camera,
  History,
  ChevronUp,
  ChevronDown,
  Check,
  Clock,
  Globe
} from "lucide-react";
import {
  LANGUAGE_OPTIONS,
  SupportedTranslateLanguage,
  TranslationRequest
} from "../../../types/translation/translationTypes";
import {useLikedTranslations, useTranslateQueries, useTranslationHistory} from "../../../hooks/useTranslationQueries";
import LangHistory from "./subTabs/LangHistory";

export interface LanguageHelpProps {}

interface Translation {
  id: string;
  source: string;
  target: string;
  timestamp: Date;
}

function LanguageHelp(props: LanguageHelpProps) {
  const [sourceText, setSourceText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [sourceLang, setSourceLang] = useState<SupportedTranslateLanguage>("en");
  const [targetLang, setTargetLang] = useState<SupportedTranslateLanguage>('ko');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTab, setSelectedTab] = useState(0);
  const [translationHistory, setTranslationHistory] = useState<Translation[]>([]);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [isTyping, setIsTyping] = useState(false);
  const [copiedText, setCopiedText] = useState('');
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  
  const sourceLanguageCollection = createListCollection({
    items: LANGUAGE_OPTIONS,
  });
  const targetLanguageCollection = createListCollection({
    items: LANGUAGE_OPTIONS,
  });
  
  // mutation
  const translateMutation = useTranslateQueries();
  
  const debouncedTranslate = useCallback(async (text: string) => {
    if (!text.trim()) {
      setTranslatedText("");
      setIsLoading(false);
      return;
    }
    
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();
    setIsLoading(true);
    
    try {
      const translationRequest: TranslationRequest = {
        sourceText: text,
        sourceLanguage: sourceLang,
        targetLanguage: targetLang
      };
      const response = await translateMutation.mutateAsync(translationRequest);
      if (!abortControllerRef.current.signal.aborted && response.status === 200) {
        setTranslatedText(response.data.targetText);
        
        // Add to history
        const newTranslation: Translation = {
          id: Date.now().toString(),
          source: text,
          target: response.data.targetText,
          timestamp: new Date()
        };
        setTranslationHistory(prev => [newTranslation, ...prev].slice(0, 10));
      }
    } catch (error) {
      if (!abortControllerRef.current?.signal.aborted) {
        console.error('Translation error:', error);
      }
    } finally {
      setIsLoading(false);
    }
  }, [sourceLang, targetLang, translateMutation]);
  
  const swapLanguages = () => {
    setSourceLang(targetLang);
    setTargetLang(sourceLang);
    setSourceText(translatedText);
    setTranslatedText(sourceText);
  };
  
  const handleSpeak = (text: string, lang: SupportedTranslateLanguage) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang === 'ko' ? 'ko-KR' : 'en-US';
      window.speechSynthesis.speak(utterance);
    }
  };
  
  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(text);
    setTimeout(() => setCopiedText(''), 2000);
  };
  
  const handleCardClick = (e: any) => {
    if ((e.target as HTMLElement).closest(".chakra-card__root"))
      setIsExpanded(!isExpanded);
  };
  
  useEffect(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    
    setIsTyping(true);
    
    debounceTimerRef.current = setTimeout(() => {
      setIsTyping(false);
      debouncedTranslate(sourceText);
    }, 1500);
    
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [sourceText, sourceLang, targetLang]);
  
  return (
    <Card.Root
      bg="white"
      overflow="hidden"
      onClick={handleCardClick}
      css={{
        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        cursor: "pointer",
        border: "1px solid #e5e7eb",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
        }
      }}
    >
      <Card.Body>
        <VStack align="stretch" gap={4}>
          {/* Header */}
          <HStack justify="space-between">
            <HStack gap={3}>
              <Box
                p={2}
                borderRadius="lg"
                css={{
                  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  color: "white"
                }}
              >
                <Languages size={24} />
              </Box>
              <Text fontSize="lg" fontWeight="semibold" color="gray.800">
                Language Helper
              </Text>
            </HStack>
            <Box color="gray.400">
              {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </Box>
          </HStack>
          
          {/* Tabs */}
          <Box onClick={(e: any) => e.stopPropagation()}>
            <Tabs.Root
              value={selectedTab.toString()}
              onValueChange={(e: any) => {
                setSelectedTab(parseInt(e.value));
              }}
              onClick={() => {
                setIsExpanded(true);
              }}
            >
              <Tabs.List
                bg="gray.50"
                borderRadius="xl"
                p={1}
                css={{
                  border: "1px solid #e5e7eb",
                }}
              >
                <Tabs.Trigger
                  value="0"
                  css={{
                    color: "#6b7280",
                    borderRadius: "lg",
                    fontWeight: "500",
                    transition: "all 0.2s",
                    "&[data-selected]": {
                      background: "white",
                      color: "#6366f1",
                      fontWeight: "600",
                      boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)"
                    },
                    "&:hover:not([data-selected])": {
                      background: "#f9fafb"
                    }
                  }}
                >
                  Translate
                </Tabs.Trigger>
                <Tabs.Trigger
                  value="1"
                  css={{
                    color: "#6b7280",
                    borderRadius: "lg",
                    fontWeight: "500",
                    transition: "all 0.2s",
                    "&[data-selected]": {
                      background: "white",
                      color: "#6366f1",
                      fontWeight: "600",
                      boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)"
                    },
                    "&:hover:not([data-selected])": {
                      background: "#f9fafb"
                    }
                  }}
                >
                  Quick Phrases
                </Tabs.Trigger>
                <Tabs.Trigger
                  value="2"
                  css={{
                    color: "#6b7280",
                    borderRadius: "lg",
                    fontWeight: "500",
                    transition: "all 0.2s",
                    "&[data-selected]": {
                      background: "white",
                      color: "#6366f1",
                      fontWeight: "600",
                      boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)"
                    },
                    "&:hover:not([data-selected])": {
                      background: "#f9fafb"
                    }
                  }}
                >
                  History
                </Tabs.Trigger>
              </Tabs.List>
              
              {isExpanded && (
                <>
                  <Tabs.Content value="0">
                    <VStack gap={4} mt={4} h="20rem" overflowY="auto">
                      {/* Language Selector */}
                      <HStack justify="space-between" w="full" gap={2}>
                        <Select.Root
                          collection={sourceLanguageCollection}
                          value={[sourceLang]}
                          onValueChange={(details: any) => {
                            setSourceLang(details.value[0] as SupportedTranslateLanguage);
                          }}
                          size="md"
                        >
                          <Select.Trigger
                            css={{
                              background: "#f9fafb",
                              border: "2px solid #e5e7eb",
                              color: "#374151",
                              borderRadius: "12px",
                              fontWeight: "500",
                              transition: "all 0.2s",
                              "&:hover": {
                                borderColor: "#9ca3af",
                                background: "white"
                              },
                              "&:focus": {
                                outline: "none",
                                borderColor: "#6366f1",
                                background: "white",
                                boxShadow: "0 0 0 3px rgba(99, 102, 241, 0.1)"
                              }
                            }}
                          >
                            <Select.ValueText placeholder="Source Language" />
                          </Select.Trigger>
                          <Select.Positioner>
                            <Select.Content
                              css={{
                                background: "white",
                                borderRadius: "12px",
                                boxShadow: "0 10px 40px rgba(0, 0, 0, 0.15)",
                                border: "1px solid #e5e7eb",
                                overflow: "hidden"
                              }}
                            >
                              {sourceLanguageCollection.items.map((item: any) => (
                                <Select.Item
                                  item={item}
                                  key={item.value}
                                  css={{
                                    padding: "10px 16px",
                                    transition: "background 0.2s",
                                    "&:hover": {
                                      background: "linear-gradient(90deg, #f3f4f6 0%, #f9fafb 100%)"
                                    },
                                    "&[data-selected]": {
                                      background: "#ede9fe",
                                      color: "#6366f1"
                                    }
                                  }}
                                >
                                  <HStack gap={2}>
                                    <Text fontSize="lg">{item.flag}</Text>
                                    <Text fontWeight="500">{item.label}</Text>
                                  </HStack>
                                  <Select.ItemIndicator />
                                </Select.Item>
                              ))}
                            </Select.Content>
                          </Select.Positioner>
                        </Select.Root>
                        
                        <IconButton
                          aria-label="Swap languages"
                          size="md"
                          variant="ghost"
                          onClick={swapLanguages}
                          css={{
                            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                            color: "white",
                            borderRadius: "12px",
                            minWidth: "44px",
                            "&:hover": {
                              transform: "rotate(180deg)",
                              background: "linear-gradient(135deg, #764ba2 0%, #667eea 100%)"
                            },
                            transition: "all 0.3s"
                          }}
                        >
                          <ArrowRightLeft size={20} />
                        </IconButton>
                        
                        <Select.Root
                          collection={targetLanguageCollection}
                          value={[targetLang]}
                          onValueChange={(details: any) => setTargetLang(details.value[0] as SupportedTranslateLanguage)}
                          size="md"
                        >
                          <Select.Trigger
                            css={{
                              background: "#f9fafb",
                              border: "2px solid #e5e7eb",
                              color: "#374151",
                              borderRadius: "12px",
                              fontWeight: "500",
                              transition: "all 0.2s",
                              "&:hover": {
                                borderColor: "#9ca3af",
                                background: "white"
                              },
                              "&:focus": {
                                outline: "none",
                                borderColor: "#6366f1",
                                background: "white",
                                boxShadow: "0 0 0 3px rgba(99, 102, 241, 0.1)"
                              }
                            }}
                          >
                            <Select.ValueText placeholder="Target Language" />
                          </Select.Trigger>
                          <Select.Positioner>
                            <Select.Content
                              css={{
                                background: "white",
                                borderRadius: "12px",
                                boxShadow: "0 10px 40px rgba(0, 0, 0, 0.15)",
                                border: "1px solid #e5e7eb",
                                overflow: "hidden"
                              }}
                            >
                              {targetLanguageCollection.items.map((item: any) => (
                                <Select.Item
                                  item={item}
                                  key={item.value}
                                  css={{
                                    padding: "10px 16px",
                                    transition: "background 0.2s",
                                    "&:hover": {
                                      background: "linear-gradient(90deg, #f3f4f6 0%, #f9fafb 100%)"
                                    },
                                    "&[data-selected]": {
                                      background: "#ede9fe",
                                      color: "#6366f1"
                                    }
                                  }}
                                >
                                  <HStack gap={2}>
                                    <Text fontSize="lg">{item.flag}</Text>
                                    <Text fontWeight="500">{item.label}</Text>
                                  </HStack>
                                  <Select.ItemIndicator />
                                </Select.Item>
                              ))}
                            </Select.Content>
                          </Select.Positioner>
                        </Select.Root>
                      </HStack>
                      
                      {/* Input Area */}
                      <Box position="relative" w="full">
                        <Textarea
                          value={sourceText}
                          onChange={(e) => setSourceText(e.target.value)}
                          placeholder={isTyping ? "Typing..." : "Enter text to translate..."}
                          rows={3}
                          css={{
                            background: "#f9fafb",
                            border: "2px solid #e5e7eb",
                            color: "#111827",
                            borderRadius: "12px",
                            padding: "12px",
                            paddingBottom: "40px",
                            fontSize: "15px",
                            minHeight: "100px",
                            maxHeight: "150px",
                            resize: "vertical",
                            transition: "all 0.2s",
                            "::placeholder": {
                              color: "#9ca3af"
                            },
                            "&:hover": {
                              borderColor: "#d1d5db",
                              background: "#fcfcfc"
                            },
                            "&:focus": {
                              outline: "none",
                              borderColor: "#6366f1",
                              background: "white",
                              boxShadow: "0 0 0 3px rgba(99, 102, 241, 0.1)"
                            }
                          }}
                        />
                        <HStack position="absolute" bottom={2} right={2} gap={1}>
                          <IconButton
                            aria-label="Voice input"
                            size="sm"
                            variant="ghost"
                            css={{
                              color: "#6b7280",
                              borderRadius: "8px",
                              "&:hover": {
                                background: "#e5e7eb",
                                color: "#6366f1"
                              }
                            }}
                          >
                            <Mic size={18} />
                          </IconButton>
                          <IconButton
                            aria-label="Camera"
                            size="sm"
                            variant="ghost"
                            css={{
                              color: "#6b7280",
                              borderRadius: "8px",
                              "&:hover": {
                                background: "#e5e7eb",
                                color: "#6366f1"
                              }
                            }}
                          >
                            <Camera size={18} />
                          </IconButton>
                        </HStack>
                      </Box>
                      
                      {/* Translation Result */}
                      {(translatedText || isLoading || isTyping) && (
                        <Box
                          w="full"
                          p={4}
                          css={{
                            background: "linear-gradient(135deg, #ede9fe 0%, #fce7f3 100%)",
                            border: "2px solid #e9d5ff",
                            borderRadius: "12px",
                            position: "relative",
                            overflow: "hidden"
                          }}
                        >
                          <Box
                            css={{
                              position: "absolute",
                              top: 0,
                              left: 0,
                              right: 0,
                              height: "4px",
                              background: "linear-gradient(90deg, #667eea 0%, #764ba2 100%)",
                              opacity: isLoading ? 1 : 0,
                              transition: "opacity 0.3s",
                              "&::after": {
                                content: '""',
                                position: "absolute",
                                top: 0,
                                left: 0,
                                right: 0,
                                height: "100%",
                                background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent)",
                                animation: isLoading ? "shimmer 1.5s infinite" : "none"
                              }
                            }}
                          />
                          <HStack justify="space-between" mb={2}>
                            <HStack gap={2}>
                              <Globe size={14} color="#6366f1" />
                              <Text fontSize="xs" color="purple.700" fontWeight="600">
                                Translation
                              </Text>
                            </HStack>
                            {translatedText && !isLoading && !isTyping && (
                              <HStack gap={1}>
                                <IconButton
                                  aria-label="Speak"
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => handleSpeak(translatedText, targetLang)}
                                  css={{
                                    color: "#6366f1",
                                    borderRadius: "8px",
                                    "&:hover": {
                                      background: "rgba(99, 102, 241, 0.1)"
                                    }
                                  }}
                                >
                                  <Volume2 size={16} />
                                </IconButton>
                                <IconButton
                                  aria-label="Copy"
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => handleCopy(translatedText)}
                                  css={{
                                    color: copiedText === translatedText ? "#10b981" : "#6366f1",
                                    borderRadius: "8px",
                                    "&:hover": {
                                      background: "rgba(99, 102, 241, 0.1)"
                                    }
                                  }}
                                >
                                  {copiedText === translatedText ? <Check size={16} /> : <Copy size={16} />}
                                </IconButton>
                              </HStack>
                            )}
                          </HStack>
                          {(isLoading || isTyping) ? (
                            <Text fontSize="sm" color="gray.500" fontStyle="italic">
                              {isTyping ? "Waiting for input..." : "Translating..."}
                            </Text>
                          ) : (
                            <Text fontSize="md" color="gray.800" lineHeight="1.6" fontWeight="500">
                              {translatedText}
                            </Text>
                          )}
                        </Box>
                      )}
                    </VStack>
                  </Tabs.Content>
                  
                  <Tabs.Content value="1">
                    <VStack gap={3} mt={4} h="20rem" overflowY="auto">
                      <Box
                        textAlign="center"
                        py={8}
                        css={{
                          background: "#f9fafb",
                          borderRadius: "12px",
                          border: "1px dashed #d1d5db"
                        }}
                      >
                        <Globe size={32} color="#9ca3af" style={{ margin: "0 auto 12px" }} />
                        <Text fontSize="sm" color="gray.500">
                          Quick phrases coming soon...
                        </Text>
                      </Box>
                    </VStack>
                  </Tabs.Content>
                  
                  <Tabs.Content value="2">
                    <LangHistory selectedTabNumber={selectedTab}/>
                  </Tabs.Content>
                </>
              )}
            </Tabs.Root>
          </Box>
        </VStack>
      </Card.Body>
    </Card.Root>
  );
}

export default LanguageHelp;