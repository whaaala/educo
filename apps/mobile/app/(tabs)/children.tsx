import { SafeAreaView } from 'react-native-safe-area-context';
import ListDetail from '../../components/ui/ListDetail';
import { APP_PLACES } from '../../components/ui/BottomTabBar';
import { useTheme } from '../../contexts/ThemeContext';
import { activePlace } from '@core/app-shell';

/** The Children place: its list-detail (A-2 change 4) — which list it opens is the place's `list` in config/app-shell.json. */
const CHILDREN = activePlace(APP_PLACES, '/children')!; // this route's own place

export default function ChildrenScreen() {
  const { colors } = useTheme();
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={['top']}>
      <ListDetail listId={CHILDREN.list!} base={CHILDREN.href} openId={null} />
    </SafeAreaView>
  );
}
