import {
  View,
  Text,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Image,
  TextInput,
  Platform,
  Keyboard,
} from 'react-native';
import React from 'react';

const InputField = ({
  label,
  labelStyle,
  icon,
  secureTextEntry = false,
  containerStyle,
  inputStyle,
  iconStyle,
  className,
  ...props
}) => {
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View className="my-2 w-full">
        <Text
          className={`text-lg font-JakartaSemiBold mb-3
        ${labelStyle}`}
        >
          {label}
        </Text>
        <View
          className={`flex flex-row justify-start items-center 
            relative bg-neutral-100 rounded-full border border-neural-100
             focus:border-primary-500
             ${containerStyle}`}
        >
          {icon && (
            <Image source={icon} className={`w-6 h-6 ml-4 ${iconStyle} `} />
          )}
          <TextInput
            className={`rounded-full  p-4 font-JakartaSemiBold text-[15px]
              flex-1 ${inputStyle} text-left`}
            secureTextEntry={secureTextEntry}
            autoCorrect={false}
            {...props}
          />
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default InputField;
