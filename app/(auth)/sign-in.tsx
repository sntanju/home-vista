import { useSignIn } from '@clerk/expo';
import { Link, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, Image, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function SignIn() {

    const { signIn, errors, fetchStatus } = useSignIn();

    const router = useRouter();

    const [email, setEmail] = useState('');
    const [password, setpassword] = useState('');
    const [code, setcode] = useState('');

    const isLoading = fetchStatus === "fetching";
    
    const onSignInPress = async () => {
        const { error } = await signIn.password({
            emailAddress: email,
            password,
        });

        if (error) {
            alert(error.message);
            return;
        }

        if(signIn.status === 'complete') {
            await signIn.finalize({
                navigate: ({session, decorateUrl}) => {
                    if(session?.currentTask) {
                        console.log(session?.currentTask);
                        return;
                    }

                    const url = decorateUrl('/');
                    router.replace(url as any);
                },
            });
        }
        else if(signIn.status === 'needs_second_factor') {
            await signIn.mfa.sendPhoneCode();
        }
        else if(signIn.status === 'needs_client_trust') {
           const emailCodeFactor = signIn.supportedSecondFactors.find(
                (factor) => factor.strategy === 'email_code',
            );

            if(emailCodeFactor) {
                await signIn.mfa.sendEmailCode();
            }
        }
            else {
                console.error('Sign In attempt not complete: ', signIn);
            }
    };

    const onVerifyPress = async () => {
        await signIn.mfa.verifyEmailCode({
            code,
        });

        if(signIn.status === 'complete') {
            await signIn.finalize({
                navigate: ({session, decorateUrl}) => {
                    if(session?.currentTask) {
                        console.log(session?.currentTask);
                        return;
                    }

                    const url = decorateUrl('/');
                    router.replace(url as any);
                },
            });
        }
    };


    if (
        signIn.status === 'needs_client_trust' ) {

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

            <TouchableOpacity onPress={() => signIn.mfa.sendEmailCode()} className=' py-2' >
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
                <Text className='text-3xl font-bold mb-3 text-grey-800'>Welcome Back</Text>
                <Text className=' mb-3 text-gray-500'>Sign In To Your Account</Text>

                <TextInput className='w-full border border-gray-300 rounded-xl px-4 py-3 mb-4'
                    placeholder='Email' autoCapitalize='none' keyboardType='email-address' placeholderTextColor='#9CA3AF' value={email} onChangeText={setEmail} />
                {errors.fields.identifier && (
                    <Text className='text-red-500 mb-4' >
                        {errors.fields.identifier?.message}
                    </Text>
                )}


                <TextInput className='w-full border border-gray-300 rounded-xl px-4 py-3 mb-4'
                    placeholder='Password' placeholderTextColor='#9CA3AF' value={password} onChangeText={setpassword} secureTextEntry />
                {errors.fields.password && (
                    <Text className='text-red-500 mb-4' >
                        {errors.fields.password?.message}
                    </Text>
                )}

                <TouchableOpacity onPress={onSignInPress} disabled={isLoading} className='w-full bg-blue-600 py-4 rounded-xl items-center mb-4' >
                    {isLoading ? (
                        <ActivityIndicator color='white' />
                    ) :
                        <Text className='text-white font-bold text-base'>
                            Sign In</Text>}
                </TouchableOpacity>

                <View className='flex-row justify-center'>
                    <Text className='text-gray-500' > Don&apos;t have an account? </Text>
                    <Link href='/sign-up'>
                        <Text className='text-blue-600 font-semibold'> Sign Up</Text>
                    </Link>
                </View>

                <View nativeID='clerk-captcha' />

            </View>
        </ScrollView>

    )
}