import { useAuth } from '@clerk/expo';
import { useRouter } from 'expo-router';
import React from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Profile() {

  const router = useRouter();
  const {signOut} = useAuth();

  const handleSignOut = async () => {
    try{
      await signOut();
      router.replace('/sign-in');
    }
    catch(error) {
      console.error("Error Signing Out: ", error);
    }
  }


  return (
    <SafeAreaView className='flex-1'>
      <Text>Profile</Text>
      <TouchableOpacity onPress={handleSignOut} ><Text>SignOut</Text></TouchableOpacity>
    </SafeAreaView>
  )
}