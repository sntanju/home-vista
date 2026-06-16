import { useAuth, useSignUp } from '@clerk/expo';
import { Link, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, Image, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function SignUp() {

    const { signUp, errors, fetchStatus } = useSignUp();
    const { isSignedIn } = useAuth();

    const router = useRouter();

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setpassword] = useState('');
    const [code, setcode] = useState('');

    const isLoading = fetchStatus === "fetching";

    if(signUp.status === 'complete' || isSignedIn) {
        return null;
    }
    
    const onSignUpPress = async () => {
        const { error } = await signUp.password({
            emailAddress: email,
            password,
            firstName,
            lastName,
        });

        if (error) {
            alert(error.message);
            return;
        }
        if (!error) await signUp.verifications.sendEmailCode();
    };

    const onVerifyPress = async () => {
        await signUp.verifications.verifyEmailCode({
            code,
        });

        if(signUp.status === 'complete') {
            await signUp.finalize({
                navigate: ({decorateUrl}) => {
                    const url = decorateUrl('/');
                    router.replace(url as any);
                },
            });
        }
    };


    if (
        signUp.status === "missing_requirements" &&
        signUp.unverifiedFields.includes('email_address') &&
        signUp.missingFields.length === 0
    ) {

        return (<View className='flex-1 items-center justify-center bg-white px-6 py-3'>

            <Image source={require("../../assets/images/logo.jpg")} className='w-32 h-16 mb-4' resizeMode='contain' />
            <Text className='text-3xl font-bold mb-3 text-grey-800'>Verify Your Account</Text>
            <Text className=' mb-3 text-gray-500'>We sent a code to {email} </Text>



            <TextInput className='w-full border border-gray-300 rounded-xl px-4 py-3'
                placeholder='Enter Verification Code' placeholderTextColor='#9CA3AF' value={code} onChangeText={setcode} keyboardType='number-pad' />
            {errors.fields.code && (
                <Text className='text-red-500 mb-4'>{errors.fields.code.message}</Text>
            )}

            <TouchableOpacity onPress={onVerifyPress} disabled={isLoading} className='w-full bg-blue-600 py-4 rounded-xl items-center mb-4' >
                {isLoading ? (
                    <ActivityIndicator color='white' />
                ) :
                    <Text className='text-white font-bold text-base'>
                       Verify</Text>}
            </TouchableOpacity>

            <TouchableOpacity onPress={() => signUp.verifications.sendEmailCode()} className=' py-2' >
                {isLoading ? (
                    <ActivityIndicator color='white' />
                ) :
                    <Text className='text-blue-600'>
                      I need a new code</Text>}
            </TouchableOpacity>


        </View>
        )
    }


    return (
        <ScrollView
            contentContainerStyle={{ flexGrow: 1 }} className='bg-white' keyboardShouldPersistTaps="handled" >
            <View className='flex-1 items-center justify-center bg-white px-6 py-3'>

                <Image source={require("../../assets/images/logo.jpg")} className='w-32 h-16 mb-4' resizeMode='contain' />
                <Text className='text-3xl font-bold mb-3 text-grey-800'>Create Account</Text>
                <Text className=' mb-3 text-gray-500'>Find Your Dream Home Today</Text>


                <View className='flex-row gap-3 mb-4'>
                    <TextInput className='flex-1 border border-gray-300 rounded-xl px-4 py-3'
                        placeholder='First Name' autoCapitalize='words' placeholderTextColor='#9CA3AF' value={firstName} onChangeText={setFirstName} />

                    <TextInput className='flex-1 border border-gray-300 rounded-xl px-4 py-3'
                        placeholder='Last Name' autoCapitalize='words' placeholderTextColor='#9CA3AF' value={lastName} onChangeText={setLastName} />
                </View>


                <TextInput className='w-full border border-gray-300 rounded-xl px-4 py-3 mb-4'
                    placeholder='Email' autoCapitalize='none' keyboardType='email-address' placeholderTextColor='#9CA3AF' value={email} onChangeText={setEmail} />
                {errors.fields.emailAddress && (
                    <Text className='text-red-500 mb-4' >
                        {errors.fields.emailAddress?.message}
                    </Text>
                )}


                <TextInput className='w-full border border-gray-300 rounded-xl px-4 py-3 mb-4'
                    placeholder='Password' placeholderTextColor='#9CA3AF' value={password} onChangeText={setpassword} secureTextEntry />
                {errors.fields.password && (
                    <Text className='text-red-500 mb-4' >
                        {errors.fields.password?.message}
                    </Text>
                )}

                <TouchableOpacity onPress={onSignUpPress} disabled={isLoading} className='w-full bg-blue-600 py-4 rounded-xl items-center mb-4' >
                    {isLoading ? (
                        <ActivityIndicator color='white' />
                    ) :
                        <Text className='text-white font-bold text-base'>
                            Sign Up</Text>}
                </TouchableOpacity>

                <View className='flex-row justify-center'>
                    <Text className='text-gray-500' > Already have an account? </Text>
                    <Link href='/sign-in'>
                        <Text className='text-blue-600 font-semibold'> Sign In</Text>
                    </Link>
                </View>

                <View nativeID='clerk-captcha' />

            </View>
        </ScrollView>

    )
}