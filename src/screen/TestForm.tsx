import React, { useState } from 'react';
import { FormProvider, useForm, useFormContext } from 'react-hook-form';
import { Button, View } from 'react-native';
import { TestForm2 } from './TestFrom2';

export function TestForm() {
  const [, setInit] = useState(0);

  const methods = useForm();
  const { watch } = useFormContext();

  console.log(watch());
  console.log('MyComp render:');
  return (
    <FormProvider {...methods}>
      <View>
        <Button
          title="ok"
          onPress={() => {
            setInit(pre => {
              let pres = pre + 1;
              methods.setValue('email', { pres });
              return pres;
            });
          }}
        />
        <TestForm2 />
      </View>
    </FormProvider>
  );
}
