import { Text, View } from 'react-native';

import { Screen } from '../../components/ui/Screen';

export default function ChildrenScreen() {
  return (
    <Screen backgroundClassName="bg-slate-50">
      <View className="gap-2">
        <Text className="text-lg font-extrabold text-slate-900">Children</Text>
        <Text className="text-sm text-slate-600">Tablet split-view and child management will live here.</Text>
      </View>
    </Screen>
  );
}


