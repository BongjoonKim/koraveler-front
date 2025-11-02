import React, {MouseEvent, useCallback, useEffect, useRef, useState} from 'react';
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
  Globe, MessageSquare
} from "lucide-react";
import {
  LANGUAGE_OPTIONS,
  SupportedTranslateLanguage,
  TranslationRequest
} from "../../../types/translation/translationTypes";
import {useLikedTranslations, useTranslateQueries, useTranslationHistory} from "../../../hooks/useTranslationQueries";
import LangHistory from "./subTabs/LangHistory";
import QuickPhrase from "./subTabs/QuickPharse";
import DoTranslation from "./subTabs/DoTranslation";
import {useCurrentUser} from "../../../hooks/useCurrentUser";
import NeedLogin from "../../../component/page/LoginPage/NeedLogin";
import {useNavigate} from "react-router-dom";
import {BLOG_LIST_SORTS, BlogListSortsOptionsType} from "../../../constants/constants";
import styled from "styled-components";

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
  const [pronunciation, setPronunciation] = useState<string | undefined>("")
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
  const currentUser = useCurrentUser();
  const navigate = useNavigate();
  
  // mutation
  

  

  

  
  const handleCardClick = (e: any) => {
    if ((e.target as HTMLElement).closest(".chakra-card__root"))
      setIsExpanded(!isExpanded);
  };
  

  
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
          <Box onClick={(e: MouseEvent) => e.stopPropagation()}>
            {!currentUser ? (
              <>
                {isExpanded ? (
                  <NeedLogin
                    feature="Route Finder"
                    onLoginClick={() => navigate('/login')}
                  />
                ) : (<></>)}
              </>
            ) : (
              <Tabs.Root
                value={selectedTab.toString()}
                onValueChange={(e : { value: string }) => {
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
                      <DoTranslation />
                    </Tabs.Content>
                    <Tabs.Content value="1">
                      <QuickPhrase
                        selectedTabNumber={selectedTab}
                        onPhraseClick={(item) => {
                          // 클릭한 항목으로 번역 필드 채우기 등의 동작
                          // console.log('Selected phrase:', item);
                        }}
                      />
                    </Tabs.Content>
                    <Tabs.Content value="2">
                      <LangHistory selectedTabNumber={selectedTab}/>
                    </Tabs.Content>
                  </>
                )}
              </Tabs.Root>
            )}
          </Box>
        </VStack>
      </Card.Body>
    </Card.Root>
  );
}

export default LanguageHelp;

