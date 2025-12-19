import { Text, View } from 'react-native';

import { Screen } from '../../components/ui/Screen';

export default function MoreScreen() {
  return (
    <Screen backgroundClassName="bg-slate-50">
      <View className="gap-2">
        <Text className="text-lg font-extrabold text-slate-900">More</Text>
        <Text className="text-sm text-slate-600">Meetings, homework, results, settings.</Text>
      </View>
    </Screen>
  );
}


