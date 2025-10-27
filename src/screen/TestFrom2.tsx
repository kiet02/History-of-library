import { useFormContext } from 'react-hook-form';
import { Button, View } from 'react-native';

export function TestForm2() {
  const { watch } = useFormContext();

  return (
    <View>
      <Button
        title="ok"
        onPress={() => {
          console.log(watch());
        }}
      />
    </View>
  );
}
