import styled from "styled-components";
import {
    Radio,
    RadioGroup,
    VStack,
    HStack,
    Text,
    Box,
    useColorModeValue,
    BoxProps,} from "@chakra-ui/react";
// 라디오 옵션 타입 정의
export interface RadioOption {
    value: string;
    label: string;
    disabled?: boolean;
}

// 컴포넌트 Props 타입 정의
export interface CusRadioProps extends Omit<BoxProps, 'onChange'> {
    options: (string | RadioOption)[];
    value?: string;
    onChange?: (value: string) => void;
    name?: string;
    size?: 'sm' | 'md' | 'lg';
    colorScheme?: string;
    direction?: 'vertical' | 'horizontal';
    spacing?: number;
    isDisabled?: boolean;
    isRequired?: boolean;
    label?: string;
    helperText?: string;
    errorMessage?: string;
    isInvalid?: boolean;
}

function CusRadio(props: CusRadioProps) {
  const {
      options = [],
      value,
      onChange,
      name,
      size = 'md',
      colorScheme = 'blue',
      direction = 'vertical',
      spacing = 3,
      isDisabled = false,
      isRequired = false,
      label,
      helperText,
      errorMessage,
      isInvalid = false,
  } = props;
    const textColor = useColorModeValue('gray.700', 'gray.200');
    const helperTextColor = useColorModeValue('gray.500', 'gray.400');
    const errorColor = useColorModeValue('red.500', 'red.300');
    
    const Container = direction === 'horizontal' ? HStack : VStack;
    
    return (
      <Box {...props}>
          {label && (
            <Text
              fontSize="sm"
              fontWeight="medium"
              color={textColor}
              mb={2}
            >
                {label}
                {isRequired && (
                  <Text as="span" color={errorColor} ml={1}>
                      *
                  </Text>
                )}
            </Text>
          )}
          
          <RadioGroup
            value={value}
            onChange={onChange}
            name={name}
            size={size}
            colorScheme={colorScheme}
            isDisabled={isDisabled}
          >
              <Container spacing={spacing} align="flex-start">
                  {options.map((option, index) => {
                      const optionValue: string = typeof option === 'string' ? option : option.value;
                      const optionLabel: string = typeof option === 'string' ? option : option.label;
                      const optionDisabled: boolean = typeof option === 'object' ? option.disabled || false : false;
                      
                      return (
                        <Radio
                          key={`${optionValue}-${index}`}
                          value={optionValue}
                          isDisabled={isDisabled || optionDisabled}
                          isInvalid={isInvalid}
                        >
                            <Text fontSize={size === 'sm' ? 'sm' : 'md'} color={textColor}>
                                {optionLabel}
                            </Text>
                        </Radio>
                      );
                  })}
              </Container>
          </RadioGroup>
          
          {(helperText || errorMessage) && (
            <Text
              fontSize="sm"
              color={isInvalid ? errorColor : helperTextColor}
              mt={1}
            >
                {isInvalid ? errorMessage : helperText}
            </Text>
          )}
      </Box>
    );
};

export default CusRadio;

const StyledCusRadio = styled.div`

`;
