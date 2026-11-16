import React, { useCallback, useState } from 'react';
import {
  FlatList,
  Image,
  Pressable,
  Share,
  StyleSheet,
  Text,
  TextInput,
  View,
  type ListRenderItemInfo,
} from 'react-native';
import { ChevronLeft, Send } from 'lucide-react-native';
import assets from '../assets';
import theme from '../constants/theme';
import { APP_NAME, APP_PACKAGE, APP_VERSION, GAP, HIT_SLOP, SCREEN_PAD } from '../constants/config';
import WorkshopBackground from '../components/WorkshopBackground';
import ScreenHeader from '../components/ScreenHeader';
import SurfaceCard from '../components/SurfaceCard';
import { IconButton, PrimaryButton } from '../components/Buttons';
import { REFERENCE_CONDITIONS, REFERENCE_SOURCE } from '../game/boltReference';

const PRIVACY_TEXT =
  APP_NAME +
  " stores your custom torque values, vehicle folders and settings in this app's private " +
  'storage on your device. It does not use accounts, analytics, advertising, location, or cloud ' +
  'synchronization. The app does not upload your saved specs. Automatic Android cloud backup is ' +
  'disabled. You can remove custom specs and folders in Settings; uninstalling the app removes ' +
  'its local data. Contact & feedback shares only the message you choose to send using another ' +
  "app. Opening a reference source uses your browser and that website's privacy policy applies.";

const SOURCES_TEXT =
  'Unit factors: NIST SP 811, Appendix B.8 and B.9. ' +
  'Reference torques: ' +
  REFERENCE_SOURCE +
  '. Conditions: ' +
  REFERENCE_CONDITIONS;

type BlockKey = 'brand' | 'privacy' | 'sources' | 'contact';

const BLOCKS: BlockKey[] = ['brand', 'privacy', 'sources', 'contact'];

type Props = {
  onBack: () => void;
};

function AboutScreen({ onBack }: Props) {
  const [open, setOpen] = useState<BlockKey | null>(null);
  const [message, setMessage] = useState('');

  const togglePrivacy = useCallback(() => {
    setOpen(prev => (prev === 'privacy' ? null : 'privacy'));
  }, []);

  const toggleSources = useCallback(() => {
    setOpen(prev => (prev === 'sources' ? null : 'sources'));
  }, []);

  const shareFeedback = useCallback(() => {
    const text = message.trim();
    if (text.length === 0) {
      return;
    }
    Share.share({
      message: text + '\n\n' + APP_NAME + ' ' + APP_VERSION + ' (' + APP_PACKAGE + ')',
    }).catch(() => undefined);
  }, [message]);

  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<BlockKey>) => {
      if (item === 'brand') {
        return (
          <SurfaceCard radius={18} padding={18}>
            <View style={styles.brandRow}>
              <Image source={assets.logo} style={styles.logo} resizeMode="contain" />
              <View style={styles.brandTexts}>
                <Text style={styles.brandName}>{APP_NAME}</Text>
                <Text style={styles.brandVersion}>{'Version ' + APP_VERSION}</Text>
                <Text style={styles.brandPackage}>{APP_PACKAGE}</Text>
              </View>
            </View>
            <Text style={styles.brandBody}>
              Torque conversions and your personal workshop reference.
            </Text>
          </SurfaceCard>
        );
      }
      if (item === 'privacy') {
        return (
          <SurfaceCard>
            <Pressable
              onPress={togglePrivacy}
              hitSlop={HIT_SLOP}
              accessibilityRole="button"
              accessibilityLabel="Privacy policy"
              style={styles.rowHead}>
              <Text style={styles.rowTitle}>Privacy policy</Text>
              <Text style={styles.rowHint}>{open === 'privacy' ? 'HIDE' : 'READ'}</Text>
            </Pressable>
            {open === 'privacy' ? <Text style={styles.rowBody}>{PRIVACY_TEXT}</Text> : null}
          </SurfaceCard>
        );
      }
      if (item === 'sources') {
        return (
          <SurfaceCard>
            <Pressable
              onPress={toggleSources}
              hitSlop={HIT_SLOP}
              accessibilityRole="button"
              accessibilityLabel="Reference sources"
              style={styles.rowHead}>
              <Text style={styles.rowTitle}>Reference sources</Text>
              <Text style={styles.rowHint}>{open === 'sources' ? 'HIDE' : 'READ'}</Text>
            </Pressable>
            {open === 'sources' ? <Text style={styles.rowBody}>{SOURCES_TEXT}</Text> : null}
          </SurfaceCard>
        );
      }
      return (
        <SurfaceCard>
          <Text style={styles.rowTitle}>Contact & feedback</Text>
          <Text style={styles.rowCaption}>
            Your message is shared only with the app you pick. Saved specs are never attached.
          </Text>
          <TextInput
            value={message}
            onChangeText={setMessage}
            placeholder="What would make this tool better?"
            placeholderTextColor={theme.colors.text.muted}
            accessibilityLabel="Feedback message"
            style={styles.input}
            multiline
            maxLength={1000}
          />
          <View style={styles.action}>
            <PrimaryButton
              label="SHARE FEEDBACK"
              onPress={shareFeedback}
              Icon={Send}
              disabled={message.trim().length === 0}
            />
          </View>
        </SurfaceCard>
      );
    },
    [message, open, shareFeedback, togglePrivacy, toggleSources],
  );

  const keyExtractor = useCallback((item: BlockKey) => item, []);

  return (
    <WorkshopBackground variant="plain">
      <ScreenHeader
        title="About"
        leftSlot={<IconButton Icon={ChevronLeft} label="Go back" onPress={onBack} />}
      />
      <FlatList
        data={BLOCKS}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        ItemSeparatorComponent={Separator}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        removeClippedSubviews={false}
      />
    </WorkshopBackground>
  );
}

function Separator() {
  return <View style={styles.separator} />;
}

const styles = StyleSheet.create({
  content: {
    padding: SCREEN_PAD,
    paddingBottom: 32,
  },
  separator: {
    height: GAP,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  logo: {
    width: 72,
    height: 72,
  },
  brandTexts: {
    flex: 1,
    gap: 2,
  },
  brandName: {
    fontSize: 28,
    lineHeight: 34,
    fontWeight: '700',
    color: theme.colors.text.primary,
  },
  brandVersion: {
    ...theme.typography.support,
    color: theme.colors.text.secondary,
  },
  brandPackage: {
    ...theme.typography.caption,
    color: theme.colors.text.tertiary,
  },
  brandBody: {
    ...theme.typography.body,
    color: theme.colors.text.secondary,
    marginTop: 12,
  },
  rowHead: {
    minHeight: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  rowTitle: {
    ...theme.typography.cardTitle,
    color: theme.colors.text.primary,
  },
  rowHint: {
    ...theme.typography.caption,
    color: theme.colors.accent.secondary,
  },
  rowBody: {
    ...theme.typography.support,
    color: theme.colors.text.secondary,
    marginTop: 4,
  },
  rowCaption: {
    ...theme.typography.caption,
    color: theme.colors.text.tertiary,
    marginTop: 4,
  },
  input: {
    minHeight: 112,
    marginTop: 12,
    padding: 12,
    textAlignVertical: 'top',
    fontSize: 16,
    lineHeight: 24,
    color: theme.colors.text.primary,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.ui.border,
    backgroundColor: '#E9EFF00D',
  },
  action: {
    marginTop: 12,
  },
});

export default AboutScreen;
