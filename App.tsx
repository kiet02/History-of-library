/* eslint-disable react-native/no-inline-styles */
import { Image, View } from 'react-native';

export default function App() {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: 'black',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Image
        style={{ width: 100, height: 100 }}
        source={require('./src/utils/resouce/image/test.gif')}
      />
    </View>
  );
}
