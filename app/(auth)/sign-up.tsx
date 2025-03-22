import CustomButton from '@/components/CustomButton';
import InputField from '@/components/InputField';
import OAuth from '@/components/OAuth';
import { icons, images } from '@/constants';
import { Link, router } from 'expo-router';
import { useState } from 'react';
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  Alert,
} from 'react-native';
import { useSignUp } from '@clerk/clerk-expo';
import { ReactNativeModal } from 'react-native-modal';
// import { fetchAPI } from "@/lib/fetch";

const SignUp = () => {
  const { isLoaded, signUp, setActive } = useSignUp();
  const [showSuccessModal, setshowSuccessModal] = useState(false); // in react native, cannot show two modals at same time.
  const [form, setForm] = useState({
    name: '',
    emailAddress: '',
    password: '',
  });
  const [verification, setVerification] = useState({
    state: 'pending',
    error: '',
    code: '',
  });

  // Validation
  const [validationErrors, setValidationErrors] = useState({
    name: '',
    emailAddress: '',
    password: '',
    code: '',
  });

  // Handle submission of sign-up form
  const onSignUpPress = async () => {
    if (!isLoaded) return; // Clerk loaded

    // Start sign-up process using email and password provided
    try {
      validateField('name', form.name);
      validateField('emailAddress', form.emailAddress);
      validateField('password', form.password);
      await signUp.create({
        emailAddress: form.emailAddress,
        password: form.password,
        username: form.name,
      });

      // Send user an email with verification code
      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });

      // Set 'pendingVerification' to true to display second form
      // and capture OTP code
      setVerification({
        ...verification,
        state: 'pending',
      });
    } catch (err: any) {
      // Alert.alert('Error', err.errors[0].longMessage);
      console.error(JSON.stringify(err, null, 2));
    }
  };

  // Handle submission of verification form
  const onVerifyPress = async () => {
    console.log('form values: ' + JSON.stringify(form));
    if (!isLoaded) return;

    try {
      // Use the code the user provided to attempt verification
      console.log('HERE');
      const signUpAttempt = await signUp.attemptEmailAddressVerification({
        code: verification.code,
      });
      console.log('AFTER');

      // If verification was completed, set the session to active
      // and redirect the user
      console.log('User successfully signed up:', signUpAttempt);
      if (signUpAttempt.status === 'complete') {
        // TODO: Create user's profile data in neondb
        // await fetchAPI("/(api)/user", {
        //   method: "POST",
        //   body: JSON.stringify({
        //     name: form.name,
        //     email: form.emailAddress,
        //     clerkId: signUpAttempt.createdUserId,
        //   }),
        // });
        await setActive({ session: signUpAttempt.createdSessionId });
        router.replace('/');
        setVerification({ ...verification, state: 'success' });
      } else {
        setVerification({
          ...verification,
          state: 'failed',
          error: 'Verification failed.',
        });
      }
    } catch (err: any) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      console.log('FAILED');
      setVerification({
        ...verification,
        state: 'pending',
        error: err.errors[0].longMessage,
      });
    }
  };

  const validateField = (field: string, value: string) => {
    let error = '';

    switch (field) {
      case 'name':
        if (!value) {
          error = 'Username is required.';
        } else if (value.length < 4) {
          error = 'Username must be at least 4 characters.';
        }
        break;
      case 'emailAddress':
        if (!value) {
          error = 'Email is required.';
        } else if (!/\S+@\S+\.\S+/.test(value)) {
          error = 'Invalid email address.';
        }
        break;
      case 'password':
        if (!value) {
          error = 'Password is required.';
        } else if (value.length < 8) {
          error = 'Password must be at least 8 characters.';
        }
        break;
      case 'code':
        if (!value) {
          error = 'Code is required.';
        } else if (value.length != 6) {
          error = 'Code must be 6 characters.';
        }
        break;
      default:
        break;
    }

    setValidationErrors((prev) => ({ ...prev, [field]: error }));
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView className="flex-1 bg-white">
        <View className="flex-1 bg-white">
          <View className="relative w-full h-[200px]">
            <Image
              className="z-0 w-full h-[180px]"
              resizeMode="contain"
              source={images.lotus}
            ></Image>
            <Text className="font-JakartaBold text-3xl text-black  left-5">
              Create Your Account
            </Text>
          </View>
          <View className="p-5">
            <InputField
              label="Name"
              placeholder="Enter your name"
              icon={icons.person}
              value={form.name}
              onChangeText={(text) => {
                setForm({ ...form, name: text });
              }}
              onBlur={() => validateField('name', form.name)}
            />
            {validationErrors.name ? (
              <Text className="text-red-500 text-sm">
                {validationErrors.name}
              </Text>
            ) : null}
            <InputField
              label="Email"
              placeholder="Enter your email"
              icon={icons.email}
              value={form.emailAddress}
              onChangeText={(value) => {
                setForm({ ...form, emailAddress: value });
              }}
              autoCapitalize="none"
              onBlur={() => validateField('emailAddress', form.emailAddress)}
            />
            {validationErrors.emailAddress ? (
              <Text className="text-red-500 text-sm">
                {validationErrors.emailAddress}
              </Text>
            ) : null}
            <InputField
              label="Password"
              placeholder="Enter your password"
              icon={icons.lock}
              value={form.password}
              secureTextEntry={true}
              onChangeText={(value) => {
                setForm({ ...form, password: value });
              }}
              onBlur={() => validateField('password', form.password)}
            />
            {validationErrors.password ? (
              <Text className="text-red-500 text-sm">
                {validationErrors.password}
              </Text>
            ) : null}
            <CustomButton
              title="Sign Up"
              onPress={onSignUpPress}
              className="mt-6"
            />

            <OAuth />

            <Link
              href="/sign-in"
              className="text-lg text-center text-general-200 mt-10"
            >
              <Text> Already have an account? </Text>
              <Text className="text-primary-500"> Log in </Text>
            </Link>
          </View>
          <ReactNativeModal
            isVisible={verification.state == 'pending'}
            onModalHide={() => {
              if (verification.state == 'success') setshowSuccessModal(true);
            }}
          >
            <View className="bg-white px-7 py-9 rounded-2xl min-h-[300px]">
              <TouchableOpacity
                onPress={() => {
                  setVerification((prev) => ({ ...prev, state: 'default' }));
                }}
                style={{ alignSelf: 'flex-end' }}
              >
                <Text style={{ fontSize: 18, fontWeight: 'bold' }}>✖</Text>
              </TouchableOpacity>
              <Text className="text-2xl font-JakartaExtraBold mb-2 text-center">
                Verification
              </Text>
              <Text className="font-Jakarta mb-5">
                We've sent a verification code to{' '}
                {form.emailAddress && form.emailAddress !== ''
                  ? form.emailAddress
                  : 'the user.'}
              </Text>
              <InputField
                label="Code"
                icon={icons.lock}
                placeholder="12345"
                value={verification.code}
                keyboardType="numeric"
                onChangeText={(code) =>
                  setVerification({ ...verification, code })
                }
                onBlur={() => validateField('code', verification.code)}
              />
              {validationErrors.code ? (
                <Text className="text-red-500 text-sm">
                  {validationErrors.code}
                </Text>
              ) : null}

              <CustomButton
                title="Verify"
                onPress={onVerifyPress}
                className="mt-5 bg-success-500"
              />
            </View>
          </ReactNativeModal>
          <ReactNativeModal isVisible={showSuccessModal}>
            <View className="bg-white px-7 py-9 rounded-2xl min-h-[300px]">
              <Image
                className="w-[110px] h-[110px] mx-auto my-5"
                source={images.check}
              />

              <Text className="text-3xl font-JakartaBold text-center">
                Verified
              </Text>
              <Text className="text-base text-gray-400 font-Jakarta mt-2 text-center">
                You have successfully verified your account.
              </Text>
              <CustomButton
                title="Browse Home"
                onPress={() => {
                  router.push('/(root)/(tabs)/home');
                  setshowSuccessModal(false);
                }}
                className="mt-5"
              />
            </View>
          </ReactNativeModal>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default SignUp;
