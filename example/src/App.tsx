import * as React from 'react';
import {StyleSheet, SafeAreaView, View, Image, ScrollView} from 'react-native';
import {DemoTitle, DemoButton, DemoResponse} from './components';

import * as ImagePicker from 'react-native-image-picker';

/* toggle includeExtra */
const includeExtra = true;

/**
 * If we render an image in the page, RCTImageLoader will init its _loaders.
 * RCTNetworking will use RCTImageLoader to convert image uri to binary data first when upload image.
 * If not, RCTNetworking will use RCTFileRequestHandler to convert data (this can keep image file size).
 * */
const loadImage = false;

const uri = 'https://reactnative.dev/img/tiny_logo.png';

function onFetch(file: any) {
  const data = new FormData();
  data.append('file', file);
  fetch('http://127.0.0.1:9999/', {
    method: 'post',
    body: data,
  })
    .then(res => {
      console.log('ok', res);
    })
    .catch(e => {
      console.error('fail', e);
    });
}

export default function App() {
  const [response, setResponse] = React.useState<any>(null);

  const onButtonPress = React.useCallback((type, options) => {
    if (type === 'capture') {
      ImagePicker.launchCamera(options, setResponse);
    } else {
      ImagePicker.launchImageLibrary(options, (res: any) => {
        setResponse(res);
        if (res && res.assets) {
          onFetch(res.assets[0]);
        }
      });
    }
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <DemoTitle>🌄 React Native Image Picker</DemoTitle>
      <ScrollView>
        <View style={styles.buttonContainer}>
          {actions.map(({title, type, options}) => {
            return (
              <DemoButton
                key={title}
                onPress={() => onButtonPress(type, options)}>
                {title}
              </DemoButton>
            );
          })}
        </View>
        <DemoResponse>{response}</DemoResponse>

        {loadImage && (
          <View key={uri} style={styles.image}>
            <Image
              resizeMode="cover"
              resizeMethod="scale"
              style={{width: 200, height: 200}}
              source={{uri: uri}}
            />
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'aliceblue',
  },
  buttonContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginVertical: 8,
  },

  image: {
    marginVertical: 24,
    alignItems: 'center',
  },
});

interface Action {
  title: string;
  type: 'capture' | 'library';
  options: ImagePicker.CameraOptions | ImagePicker.ImageLibraryOptions;
}

const actions: Action[] = [
  {
    title: 'Take Image',
    type: 'capture',
    options: {
      saveToPhotos: true,
      mediaType: 'photo',
      includeBase64: false,
      includeExtra,
    },
  },
  {
    title: 'Select Image',
    type: 'library',
    options: {
      selectionLimit: 1,
      mediaType: 'photo',
      includeBase64: false,
      includeExtra,
    },
  },
  {
    title: 'Take Video',
    type: 'capture',
    options: {
      saveToPhotos: true,
      mediaType: 'video',
      includeExtra,
    },
  },
  {
    title: 'Select Video',
    type: 'library',
    options: {
      selectionLimit: 0,
      mediaType: 'video',
      includeExtra,
    },
  },
  {
    title: 'Select Image or Video\n(mixed)',
    type: 'library',
    options: {
      selectionLimit: 0,
      mediaType: 'mixed',
      includeExtra,
    },
  },
];
