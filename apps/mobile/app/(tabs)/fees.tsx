import { Text, View } from 'react-native';

import { Screen } from '../../components/ui/Screen';

export default function FeesScreen() {
  return (
    <Screen backgroundClassName="bg-slate-50">
      <View className="gap-2">
        <Text className="text-lg font-extrabold text-slate-900">Fees</Text>
        <Text className="text-sm text-slate-600">Fees and payment flows will live here.</Text>
      </View>
    </Screen>
  );
}


