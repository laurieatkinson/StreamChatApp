import {Channel, MessageInput, MessageList} from 'stream-chat-react-native';
import {useAppContext} from '../context/AppContext';
import {PermissionsAndroid, Platform, Text} from 'react-native';
import {StackScreenProps} from '@react-navigation/stack';
import {NavigationStackParamsList} from '../types';
import React, {useEffect} from 'react';

type ChannelScreenProps = StackScreenProps<
  NavigationStackParamsList,
  'ChannelScreen'
>;

export const ChannelScreen: React.FC<ChannelScreenProps> = () => {
  const {channel} = useAppContext();
  const [permissionRequested, setPermissionRequested] = React.useState(false);

  useEffect(() => {
    const requestCameraAndFilePermission = async () => {
      await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.CAMERA,
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
      ]);
      setPermissionRequested(true);
    };
    if (Platform.OS === 'android' && !permissionRequested) {
      requestCameraAndFilePermission();
    }
  }, [permissionRequested]);

  if (!channel) {
    return <Text>Loading</Text>;
  }

  return (
    <Channel channel={channel} hasFilePicker={false} hasImagePicker={true}>
      <MessageList />
      <MessageInput />
    </Channel>
  );
};
