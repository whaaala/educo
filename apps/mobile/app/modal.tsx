import { Text, View } from 'react-native';

import { Screen } from '../components/ui/Screen';

export default function ModalScreen() {
  return (
    <Screen backgroundClassName="bg-slate-50">
      <View className="gap-2">
        <Text className="text-lg font-extrabold text-slate-900">Help</Text>
        <Text className="text-sm text-slate-600">This is a placeholder modal.</Text>
      </View>
    </Screen>
  );
}


