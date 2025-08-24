import React, { useState, useCallback } from 'react';
import {
  Box,
  Flex,
  Text,
  Icon,
  Badge,
  Heading,
  IconProps,
  BoxProps,
} from '@chakra-ui/react';
import { ChevronRight } from 'lucide-react';
import {
  StaticTreeDataProvider,
  Tree,
  ControlledTreeEnvironment,
  TreeItem,
  TreeItemIndex,
} from 'react-complex-tree';
import useFolderTree from './useFolderTree';
import 'react-complex-tree/lib/style-modern.css';

// Tooltip 컴포넌트 정의 (Chakra UI v3 방식)
import { Portal } from '@chakra-ui/react';

// Tooltip 컴포넌트
interface TooltipProps {
  children: React.ReactNode;
  label: string;
  fontSize?: string;
  hasArrow?: boolean;
}

const Tooltip = ({ children, label, fontSize = "sm", hasArrow = false }: TooltipProps) => {
  const [isVisible, setIsVisible] = useState(false);
  
  return (
    <Box
      position="relative"
      display="inline-block"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      {isVisible && (
        <Portal>
          <Box
            position="absolute"
            top="100%"
            left="50%"
            transform="translateX(-50%)"
            mt={1}
            px={2}
            py={1}
            bg="gray.900"
            color="white"
            borderRadius="md"
            fontSize={fontSize}
            whiteSpace="nowrap"
            zIndex={1000}
            _before={hasArrow ? {
              content: '""',
              position: "absolute",
              top: "-4px",
              left: "50%",
              transform: "translateX(-50%)",
              borderLeft: "4px solid transparent",
              borderRight: "4px solid transparent",
              borderBottom: "4px solid",
              borderBottomColor: "gray.900"
            } : undefined}
          >
            {label}
          </Box>
        </Portal>
      )}
    </Box>
  );
};

// 트리 아이템 데이터 타입
export interface TreeItemData extends TreeItem {
  data: FoldersDTO;
  isFolder?: boolean;
  children?: TreeItemIndex[];
}

// 아이콘 컴포넌트 타입 정의
interface CustomIconProps extends IconProps {
  isOpen?: boolean;
}

// SVG 아이콘 컴포넌트들
const FolderIcon: React.FC<CustomIconProps> = ({ isOpen = false, ...props }) => (
  <Icon viewBox="0 0 24 24" {...props}>
    <path
      fill="currentColor"
      d="M10 4H4C2.89543 4 2 4.89543 2 6V18C2 19.1046 2.89543 20 4 20H20C21.1046 20 22 19.1046 22 18V8C22 6.89543 21.1046 6 20 6H12L10 4Z"
    />
  </Icon>
);

const FileIcon: React.FC<IconProps> = (props) => (
  <Icon viewBox="0 0 24 24" {...props}>
    <path
      fill="currentColor"
      d="M14 2H6C4.89543 2 4 2.89543 4 4V20C4 21.1046 4.89543 22 6 22H18C19.1046 22 20 21.1046 20 20V8L14 2Z"
    />
    <path
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
      d="M14 2V8H20"
    />
  </Icon>
);

const GlobeIcon: React.FC<IconProps> = (props) => (
  <Icon viewBox="0 0 24 24" {...props}>
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" />
    <path
      d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"
      stroke="currentColor"
      strokeWidth="2"
      fill="none"
    />
  </Icon>
);

// 컴포넌트 Props 타입
export interface FolderTreeProps {
  treeFolders?: any;
  handleFolderSelect?: (items: TreeItemIndex[]) => void;
  folders?: any;
  selectedFolderId?: string | null;
}

export default function FolderTree(props: FolderTreeProps) {
  const { folders, handleFolderSelect, selectedFolderId } = props;
  
  // 트리 상태 관리
  const [expandedItems, setExpandedItems] = useState<TreeItemIndex[]>(['root']);
  const [selectedItems, setSelectedItems] = useState<TreeItemIndex[]>([]);
  
  // 색상 정의 (하드코딩으로 변경)
  const bg = 'white';
  const borderColor = 'gray.200';
  const headerBg = 'linear-gradient(to right, #3182ce, #805ad5)';
  const hoverBg = 'gray.50';
  const selectedBg = 'blue.50';
  const selectedBorderColor = 'blue.200';
  const textColor = 'gray.700';
  const iconColor = 'gray.500';
  const folderColor = 'orange.500';
  const scrollTrackBg = '#f7fafc';
  const scrollThumbBg = '#cbd5e0';
  const scrollThumbHoverBg = '#a0aec0';
  
  // selectedFolderId가 변경될 때 selectedItems 업데이트
  React.useEffect(() => {
    if (selectedFolderId) {
      const foundKey = Object.keys(folders || {}).find(key =>
        folders[key].data?.id === selectedFolderId
      );
      setSelectedItems(foundKey ? [foundKey] : []);
    } else {
      setSelectedItems([]);
    }
  }, [selectedFolderId, folders]);
  
  // 선택 토글 핸들러
  const handleSelectionChange = useCallback((newSelectedItems: TreeItemIndex[]) => {
    // 새로 선택된 아이템이 있고, 현재 선택된 아이템과 같다면 선택 해제
    if (newSelectedItems.length > 0 && selectedItems.length > 0) {
      const newItem = newSelectedItems[0];
      const currentItem = selectedItems[0];
      
      if (newItem === currentItem) {
        // 같은 아이템을 다시 클릭한 경우 선택 해제
        setSelectedItems([]);
        handleFolderSelect?.([]);
        return;
      }
    }
    
    // 일반적인 선택 처리
    setSelectedItems(newSelectedItems);
    handleFolderSelect?.(newSelectedItems);
  }, [selectedItems, handleFolderSelect]);
  
  // 화살표 클릭 핸들러 - 폴더 토글 전용
  const handleArrowClick = useCallback((itemIndex: TreeItemIndex, isExpanded: boolean, e: React.MouseEvent) => {
    e.stopPropagation(); // 부모 클릭 이벤트 방지
    
    if (isExpanded) {
      setExpandedItems(expandedItems.filter(index => index !== itemIndex));
    } else {
      setExpandedItems([...expandedItems, itemIndex]);
    }
  }, [expandedItems]);
  
  const renderItemArrow = React.useCallback(({ item, context }: any) => (
    <Flex align="center" justify="center" w={2} h={4} mr={0}>
      {item.isFolder && item.children && item.children.length > 0 && (
        <Box
          onClick={(e) => handleArrowClick(item.index, context.isExpanded, e)}
          cursor="pointer"
          p={0}
          borderRadius="sm"
          _hover={{ bg: hoverBg }}
          transition="all 0.2s"
          ml="1.5rem"
        >
          <ChevronRight
            size={4}
            color={iconColor}
            transform={context.isExpanded ? 'rotate(90deg)' : 'rotate(0deg)'}
          />
        </Box>
      )}
    </Flex>
  ), [iconColor, textColor, hoverBg, handleArrowClick]);
  
  const renderItemTitle = React.useCallback(({ item, context }: any) => (
    <Flex
      align="center"
      py={0}
      px={0}
      mx={0}
      borderRadius="md"
      cursor="pointer"
      transition="all 0.2s"
      _hover={{
        transform: 'translateX(2px)',
      }}
    >
      {/* 아이콘 */}
      <Box mr={2}>
        {item.isFolder ? (
          <FolderIcon
            boxSize={4}
            color={folderColor}
            filter="drop-shadow(0 1px 1px rgba(0, 0, 0, 0.1))"
            isOpen={context.isExpanded}
          />
        ) : (
          <FileIcon
            boxSize={4}
            color={iconColor}
            filter="drop-shadow(0 1px 1px rgba(0, 0, 0, 0.1))"
          />
        )}
      </Box>
      
      {/* 콘텐츠 */}
      <Flex align="center" justify="space-between" flex={1} gap={3}>
        <Text
          fontSize="sm"
          fontWeight="medium"
          color={textColor}
          truncate
          flex={1}
        >
          {item.data?.name || 'Untitled'}
        </Text>
        
        {/* 공개 폴더 배지 */}
        {item.data?.public && (
          <Tooltip label="공개 폴더" fontSize="xs" hasArrow>
            <Badge
              colorScheme="green"
              variant="solid"
              borderRadius="full"
              px={2}
              py={0.5}
              fontSize="10px"
              display="flex"
              alignItems="center"
              gap={1}
              bg="green.500"
            >
              <GlobeIcon boxSize={2.5} />
              공개
            </Badge>
          </Tooltip>
        )}
      </Flex>
    </Flex>
  ), [selectedBg, hoverBg, selectedBorderColor, folderColor, iconColor, textColor]);
  
  // 로딩 상태 처리
  if (!folders || Object.keys(folders).length <= 1) {
    return (
      <Box
        bg={bg}
        borderRadius="xl"
        boxShadow="lg"
        border="1px"
        borderColor={borderColor}
        p={6}
        textAlign="center"
      >
        <Text color={textColor} fontSize="sm">
          폴더를 불러오는 중... 또는 폴더가 없습니다.
        </Text>
      </Box>
    );
  }
  
  return (
    <Box
      py={3}
      maxH="400px"
      overflowY="auto"
      css={{
        "border": "1px solid var(--chakra-colors-gray-200)",
        "border-radius": "8px",
        '&::-webkit-scrollbar': {
          width: '6px',
        },
        '&::-webkit-scrollbar-track': {
          background: scrollTrackBg,
        },
        '&::-webkit-scrollbar-thumb': {
          background: scrollThumbBg,
          borderRadius: '3px',
          '&:hover': {
            background: scrollThumbHoverBg,
          },
        },
        // react-complex-tree 기본 들여쓰기 패딩 조정
        '.rct-tree-item-title-container': {
          gap: '0px !important', // flexbox 간격 제거
        },
        // 여닫이 아이콘과 폴더 버튼이 겹치지 않도록 조정
        '.rct-tree-item-title-container > div:first-child': {
          position: 'relative',
          zIndex: '10 !important',
          marginRight: '0px !important', // 간격 제거
        },
        '.rct-tree-item-button': {
          position: 'relative',
          zIndex: '5 !important',
        },
        // 선택된 아이템의 왼쪽 표시를 숨기고 오른쪽에 표시
        '.rct-tree-item-li[data-rct-item-selected="true"]::before': {
          display: 'none !important', // 기본 왼쪽 표시 숨김
        },
        '.rct-tree-item-li[data-rct-item-selected="true"] .rct-tree-item-title-container': {
          backgroundColor: `${selectedBg} !important`,
          borderRadius: '6px !important',
        },
        '.rct-tree-item-li[data-rct-item-selected="true"]::after': {
          content: '""',
          position: 'absolute',
          right: '8px',
          top: '50%',
          transform: 'translateY(-50%)',
          width: '3px',
          height: '20px',
          backgroundColor: '#3182ce', // 파란색
          borderRadius: '2px',
        },
      }}
    >
      <ControlledTreeEnvironment
        items={folders}
        getItemTitle={(item: TreeItemData) => item.data?.name || 'Untitled'}
        viewState={{
          ['tree-1']: {
            expandedItems,
            selectedItems,
          },
        }}
        // 폴더 클릭 시 확장/축소를 비활성화
        onExpandItem={() => {}} // 빈 함수로 비활성화
        onCollapseItem={() => {}} // 빈 함수로 비활성화
        onSelectItems={handleSelectionChange}
        canDragAndDrop={false}
        canDropOnFolder={true}
        canReorderItems={true}
        renderItemArrow={renderItemArrow}
        renderItemTitle={renderItemTitle}
      >
        <Tree
          treeId="tree-1"
          rootItem="root"
          treeLabel="폴더 구조"
        />
      </ControlledTreeEnvironment>
    </Box>
  );
}