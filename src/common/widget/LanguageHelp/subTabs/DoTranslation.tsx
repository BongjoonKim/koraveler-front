import {Box, createListCollection, HStack, IconButton, Select, Text, Textarea, VStack} from "@chakra-ui/react";
import {
  LANGUAGE_OPTIONS,
  SupportedTranslateLanguage, TranslationHistory,
  TranslationRequest
} from "../../../../types/translation/translationTypes";
import {ArrowRightLeft, Check, Copy, Globe, Volume2} from "lucide-react";
import React, {useCallback, useEffect, useRef, useState} from "react";
import {useTranslateQueries} from "../../../../hooks/useTranslationQueries";

export default function DoTranslation() {
  const [sourceText, setSourceText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [pronunciation, setPronunciation] = useState<string | undefined>("")
  const [sourceLang, setSourceLang] = useState<SupportedTranslateLanguage>("en");
  const [targetLang, setTargetLang] = useState<SupportedTranslateLanguage>('ko');
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [copiedText, setCopiedText] = useState('');
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  
  const translateMutation = useTranslateQueries();
  
  
  const sourceLanguageCollection = createListCollection({
    items: LANGUAGE_OPTIONS,
  });
  const targetLanguageCollection = createListCollection({
    items: LANGUAGE_OPTIONS,
  });
  
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
        setPronunciation(response.data.pronunciation);
      }
    } catch (error) {
      if (!abortControllerRef.current?.signal.aborted) {
        console.error('Translation error:', error);
      }
    } finally {
      setIsLoading(false);
    }
  }, [sourceLang, targetLang, translateMutation]);
  
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
  
  const swapLanguages = () => {
    setSourceLang(targetLang);
    setTargetLang(sourceLang);
    setSourceText(translatedText);
    setTranslatedText(sourceText);
    setPronunciation("");
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
          {/*<IconButton*/}
          {/*  aria-label="Voice input"*/}
          {/*  size="sm"*/}
          {/*  variant="ghost"*/}
          {/*  css={{*/}
          {/*    color: "#6b7280",*/}
          {/*    borderRadius: "8px",*/}
          {/*    "&:hover": {*/}
          {/*      background: "#e5e7eb",*/}
          {/*      color: "#6366f1"*/}
          {/*    }*/}
          {/*  }}*/}
          {/*>*/}
          {/*  <Mic size={18} />*/}
          {/*</IconButton>*/}
          {/*<IconButton*/}
          {/*  aria-label="Camera"*/}
          {/*  size="sm"*/}
          {/*  variant="ghost"*/}
          {/*  css={{*/}
          {/*    color: "#6b7280",*/}
          {/*    borderRadius: "8px",*/}
          {/*    "&:hover": {*/}
          {/*      background: "#e5e7eb",*/}
          {/*      color: "#6366f1"*/}
          {/*    }*/}
          {/*  }}*/}
          {/*>*/}
          {/*  <Camera size={18} />*/}
          {/*</IconButton>*/}
        </HStack>
      </Box>
      
      {/* Translation Result */}
      {(translatedText || isLoading || isTyping) && (<Box
          w="full"
          p={4}
          css={{
            background: "linear-gradient(135deg, #ede9fe 0%, #fce7f3 100%)",
            border: "2px solid #e9d5ff",
            borderRadius: "12px",
            position: "relative"
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
              borderRadius: "12px 12px 0 0",
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
            <VStack align="flex-start" gap={1} w="full">
              <Text fontSize="md" fontWeight="600" color="gray.800">
                {translatedText}
              </Text>
              {pronunciation && (
                <Text
                  fontSize="sm"
                  color="gray.500"
                  fontStyle="italic"
                  css={{
                    display: "inline-block",
                    padding: "2px 0",
                    wordBreak: "break-word"
                  }}
                >
                  [{pronunciation}]
                </Text>
              )}
            </VStack>
          )}
        </Box>
      )}
    </VStack>
  )
}