import React, { useState, useCallback } from 'react';
import {
  Box,
  Flex,
  Text,
  Icon,
  Badge,
  useColorModeValue,
  Heading,
  Tooltip,
  IconProps,
  BoxProps,
} from '@chakra-ui/react';

import { ChevronRightIcon } from '@chakra-ui/icons';
import {
  StaticTreeDataProvider,
  Tree,
  ControlledTreeEnvironment,
  TreeItem,
  TreeItemIndex,
} from 'react-complex-tree';
import useFolderTree from './useFolderTree';
import 'react-complex-tree/lib/style-modern.css';

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
  
  // Chakra UI 색상 모드 대응
  const bg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const headerBg = useColorModeValue('linear(to-r, blue.500, purple.600)', 'linear(to-r, blue.600, purple.700)');
  const hoverBg = useColorModeValue('gray.50', 'gray.700');
  const selectedBg = useColorModeValue('blue.50', 'blue.900');
  const selectedBorderColor = useColorModeValue('blue.200', 'blue.600');
  const textColor = useColorModeValue('gray.700', 'gray.200');
  const iconColor = useColorModeValue('gray.500', 'gray.400');
  const folderColor = useColorModeValue('orange.500', 'orange.300');
  const scrollTrackBg = useColorModeValue('#f7fafc', '#2d3748');
  const scrollThumbBg = useColorModeValue('#cbd5e0', '#4a5568');
  const scrollThumbHoverBg = useColorModeValue('#a0aec0', '#718096');
  
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
  
  const renderItemArrow = React.useCallback(({ item, context }: any) => (
    <Flex align="center" justify="center" w={5} h={5} mr={1}>
      {item.isFolder && item.children && item.children.length > 0 && (
        <ChevronRightIcon
          boxSize={3}
          color={iconColor}
          transform={context.isExpanded ? 'rotate(90deg)' : 'rotate(0deg)'}
          transition="transform 0.2s"
          _hover={{ color: textColor }}
        />
      )}
    </Flex>
  ), [iconColor, textColor]);
  
  const renderItemTitle = React.useCallback(({ item, context }: any) => (
    <Flex
      align="center"
      py={1}
      px={2}
      mx={2}
      borderRadius="md"
      cursor="pointer"
      transition="all 0.2s"
      // bg={context.isSelected ? selectedBg : 'transparent'}
      _hover={{
        // bg: context.isSelected ? selectedBg : hoverBg,
        transform: 'translateX(2px)',
      }}
      // borderColor={context.isSelected ? selectedBorderColor : 'transparent'}
    >
      {/* 아이콘 */}
      <Box mr={3}>
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
          isTruncated
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
              bgGradient="linear(to-r, green.400, green.600)"
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
        onExpandItem={(item) => setExpandedItems([...expandedItems, item.index])}
        onCollapseItem={(item) =>
          setExpandedItems(expandedItems.filter(expandedItemIndex => expandedItemIndex !== item.index))
        }
        onSelectItems={handleSelectionChange}
        canDragAndDrop={false}
        canDropOnFolder={false}
        canReorderItems={false}
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