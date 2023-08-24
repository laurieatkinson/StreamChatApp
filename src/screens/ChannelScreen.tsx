import {Channel, MessageInput, MessageList} from 'stream-chat-react-native';
import {useAppContext} from '../context/AppContext';
import {Alert, PermissionsAndroid, Platform, Text} from 'react-native';
import {StackScreenProps} from '@react-navigation/stack';
import {NavigationStackParamsList} from '../types';
import React, {useEffect, useState} from 'react';

type ChannelScreenProps = StackScreenProps<
  NavigationStackParamsList,
  'ChannelScreen'
>;

export const ChannelScreen: React.FC<ChannelScreenProps> = () => {
  const {channel} = useAppContext();
  const [permissionGranted, setPermissionGranted] = useState(false);

  async function hasAndroidPermission() {
    const getCheckPermissionPromise = async () => {
      let version = Platform.Version;
      if (typeof version === 'string') {
        version = parseInt(version, 10);
      }
      if (version >= 33) {
        const [hasReadMediaImagesPermission, hasReadMediaVideoPermission] =
          await Promise.all([
            PermissionsAndroid.check(
              PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
            ),
            PermissionsAndroid.check(
              PermissionsAndroid.PERMISSIONS.READ_MEDIA_VIDEO,
            ),
          ]);
        Alert.alert(
          `Version: ${version.toString()}`,
          (
            hasReadMediaImagesPermission && hasReadMediaVideoPermission
          ).toString(),
        );
        return hasReadMediaImagesPermission && hasReadMediaVideoPermission;
      } else {
        return PermissionsAndroid.check(
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        );
      }
    };

    const getRequestPermissionPromise = async () => {
      let version = Platform.Version;
      if (typeof version === 'string') {
        version = parseInt(version, 10);
      }
      if (version >= 33) {
        const statuses = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
          PermissionsAndroid.PERMISSIONS.READ_MEDIA_VIDEO,
        ]);

        return (
          statuses[PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES] ===
            PermissionsAndroid.RESULTS.GRANTED &&
          statuses[PermissionsAndroid.PERMISSIONS.READ_MEDIA_VIDEO] ===
            PermissionsAndroid.RESULTS.GRANTED
        );
      } else {
        const status = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        );
        return status === PermissionsAndroid.RESULTS.GRANTED;
      }
    };

    const hasPermission = await getCheckPermissionPromise();
    if (hasPermission) {
      return true;
    }

    return await getRequestPermissionPromise();
  }

  useEffect(() => {
    const requestCameraAndFilePermission = async () => {
      setPermissionGranted(await hasAndroidPermission());
    };
    if (Platform.OS === 'android' && !permissionGranted) {
      requestCameraAndFilePermission();
    }
  }, [permissionGranted]);

  if (!channel) {
    return <Text>Loading</Text>;
  }

  return (
    <>
      <Channel channel={channel}>
        <MessageList />
        <MessageInput />
      </Channel>
    </>
  );
};
