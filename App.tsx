/* eslint-disable react-native/no-inline-styles */
import { useSizes } from '@utils/resource/Sizes';
import { Image, View } from 'react-native';



export default function App() {
  const{wp,hp}= useSizes();
  const gif = require('@utils/resource/image/test.gif');
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
        source={gif}
      />
      <View style={{backgroundColor:'gray', width:wp(100) , height:hp(50)}} ></View>
    </View>
  );
}
