import { useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import ListDetail from '../../components/ui/ListDetail';
import { useTheme } from '../../contexts/ThemeContext';
import { APP_PLACES } from '../../components/ui/BottomTabBar';
import { activePlace } from '@core/app-shell';

const CHILDREN = activePlace(APP_PLACES, '/children')!; // the place this detail belongs to

/** One child's detail — its own route (/children/<id>), so a deep link opens straight on it (A-2 change 4). */
export default function ChildScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { colors } = useTheme();
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={['top']}>
      <ListDetail listId={CHILDREN.list!} base={CHILDREN.href} openId={id ?? null} />
    </SafeAreaView>
  );
}
