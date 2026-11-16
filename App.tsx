/**
 * Torque Spec Sheet - screen state machine only.
 * Conversion maths lives in src/game, persistence-shaped state in src/hooks.
 */
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { BackHandler, StatusBar, StyleSheet, Vibration, View } from 'react-native';

import theme from './src/constants/theme';
import { DEFAULT_DECIMALS } from './src/constants/config';

import LoaderScreen from './src/screens/LoaderScreen';
import MenuScreen from './src/screens/MenuScreen';
import GameScreen from './src/screens/GameScreen';
import GameOverScreen from './src/screens/GameOverScreen';
import MySpecsScreen from './src/screens/MySpecsScreen';
import BoltReferenceScreen from './src/screens/BoltReferenceScreen';
import VehicleFoldersScreen from './src/screens/VehicleFoldersScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import AboutScreen from './src/screens/AboutScreen';

import SpecEditorOverlay from './src/components/SpecEditorOverlay';
import VehicleEditorOverlay from './src/components/VehicleEditorOverlay';
import ConfirmationDialog from './src/components/ConfirmationDialog';
import type { NavKey } from './src/components/BottomNavigation';

import useConverter from './src/hooks/useConverter';
import useSpecsStore from './src/hooks/useSpecsStore';
import { resolveOutputUnit, type Unit } from './src/game/torqueConversion';
import { REFERENCE_CONDITIONS, REFERENCE_SOURCE, type BoltReference } from './src/game/boltReference';
import type { ConversionSnapshot, Spec } from './src/game/conversionSession';

type Screen =
  | 'loader'
  | 'menu'
  | 'game'
  | 'gameover'
  | 'specs'
  | 'reference'
  | 'vehicles'
  | 'settings'
  | 'about';

function App(): React.JSX.Element {
  const [screen, setScreen] = useState<Screen>('loader');
  const [returnTo, setReturnTo] = useState<Screen>('menu');
  const [snapshot, setSnapshot] = useState<ConversionSnapshot | null>(null);
  const [savedId, setSavedId] = useState<string | null>(null);

  const [defaultInput, setDefaultInput] = useState<Unit>('Nm');
  const [preferredOutput, setPreferredOutput] = useState<Unit>('lb-ft');
  const [decimals, setDecimals] = useState<number>(DEFAULT_DECIMALS);
  const [haptics, setHaptics] = useState(true);
  const [reduceMotion, setReduceMotion] = useState(false);

  const [specEditorOpen, setSpecEditorOpen] = useState(false);
  const [vehicleEditorOpen, setVehicleEditorOpen] = useState(false);
  const [clearDataOpen, setClearDataOpen] = useState(false);

  const store = useSpecsStore();
  const converter = useConverter(defaultInput, preferredOutput);

  const { specs, vehicles, counts } = store;
  const recent = specs.length > 0 ? specs[0] : null;

  const goHome = useCallback(() => setScreen('menu'), []);
  const goConverter = useCallback(() => setScreen('game'), []);

  const handleNavigate = useCallback((key: NavKey) => {
    if (key === 'convert') {
      setScreen('game');
    } else if (key === 'specs') {
      setScreen('specs');
    } else if (key === 'reference') {
      setScreen('reference');
    } else {
      setScreen('vehicles');
    }
  }, []);

  const openSettings = useCallback(() => {
    setReturnTo(prev => (screen === 'settings' || screen === 'about' ? prev : screen));
    setScreen('settings');
  }, [screen]);

  const backFromSettings = useCallback(() => setScreen(returnTo), [returnTo]);

  const handleConvert = useCallback(() => {
    setSnapshot(converter.snapshot(decimals));
    setScreen('gameover');
  }, [converter, decimals]);

  const handleConvertAgain = useCallback(() => setScreen('game'), []);

  const handleSaveSpec = useCallback(
    (name: string, vehicleId: string | null) => {
      if (!snapshot) {
        return;
      }
      const id = store.saveSpec({
        name,
        nm: snapshot.nm,
        inputUnit: snapshot.inputUnit,
        vehicleId,
        origin: snapshot.origin,
        boltSize: snapshot.boltSize,
        source: snapshot.source,
        conditions: snapshot.conditions,
      });
      setSavedId(id);
      setSpecEditorOpen(false);
      setScreen('specs');
      if (haptics) {
        Vibration.vibrate(16);
      }
    },
    [haptics, snapshot, store],
  );

  const handleUseSpec = useCallback(
    (spec: Spec) => {
      converter.loadSpec(spec.nm, spec.inputUnit, spec.origin);
      setScreen('game');
    },
    [converter],
  );

  const handleUseReference = useCallback(
    (item: BoltReference, unit: Unit) => {
      converter.loadReference(item.nm, item.size, REFERENCE_SOURCE, REFERENCE_CONDITIONS, unit);
      setScreen('game');
    },
    [converter],
  );

  const handleAddVehicle = useCallback(
    (name: string, type: 'bike' | 'car' | 'other', model: string) => {
      store.addVehicle(name, type, model.length > 0 ? model : undefined);
      setVehicleEditorOpen(false);
    },
    [store],
  );

  const handleClearData = useCallback(() => {
    store.clearAll();
    setSavedId(null);
    setClearDataOpen(false);
  }, [store]);

  const handleChangeDefaultInput = useCallback((unit: Unit) => {
    setDefaultInput(unit);
    setPreferredOutput(prev => resolveOutputUnit(unit, prev));
  }, []);

  const handleChangePreferredOutput = useCallback(
    (unit: Unit) => {
      setPreferredOutput(resolveOutputUnit(defaultInput, unit));
    },
    [defaultInput],
  );

  // Android Back: overlays first, then the route, then the hub.
  useEffect(() => {
    const onBack = () => {
      if (clearDataOpen) {
        setClearDataOpen(false);
        return true;
      }
      if (vehicleEditorOpen) {
        setVehicleEditorOpen(false);
        return true;
      }
      if (specEditorOpen) {
        setSpecEditorOpen(false);
        return true;
      }
      if (screen === 'settings' || screen === 'about') {
        setScreen(screen === 'about' ? 'settings' : returnTo);
        return true;
      }
      if (screen === 'gameover') {
        setScreen('game');
        return true;
      }
      if (screen !== 'menu' && screen !== 'loader') {
        setScreen('menu');
        return true;
      }
      return false;
    };

    const subscription = BackHandler.addEventListener('hardwareBackPress', onBack);
    return () => subscription.remove();
  }, [clearDataOpen, returnTo, screen, specEditorOpen, vehicleEditorOpen]);

  const displayUnit = useMemo(() => preferredOutput, [preferredOutput]);

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor={theme.colors.bg.primary} />

      {screen === 'loader' ? <LoaderScreen onDone={goHome} /> : null}

      {screen === 'menu' ? (
        <MenuScreen
          specCount={counts.specs}
          vehicleCount={counts.vehicles}
          recentName={recent ? recent.name : null}
          recentNm={recent ? recent.nm : 0}
          displayUnit={displayUnit}
          decimals={decimals}
          onStartConverting={goConverter}
          onOpenSpecs={() => setScreen('specs')}
          onOpenVehicles={() => setScreen('vehicles')}
          onOpenReference={() => setScreen('reference')}
          onOpenSettings={openSettings}
          onNavigate={handleNavigate}
        />
      ) : null}

      {screen === 'game' ? (
        <GameScreen
          draft={converter.draft}
          valid={converter.valid}
          decimals={decimals}
          onChangeText={converter.setText}
          onChangeInputUnit={converter.setInputUnit}
          onChangeOutputUnit={converter.setOutputUnit}
          onChangeStep={converter.setStep}
          onSwap={converter.swapUnits}
          onStepStart={converter.startRepeat}
          onStepStop={converter.stopRepeat}
          onReset={converter.reset}
          onConvert={handleConvert}
          onHome={goHome}
          onOpenSettings={openSettings}
          onNavigate={handleNavigate}
        />
      ) : null}

      {screen === 'gameover' && snapshot ? (
        <GameOverScreen
          snapshot={snapshot}
          onSave={() => setSpecEditorOpen(true)}
          onConvertAgain={handleConvertAgain}
          onViewSpecs={() => setScreen('specs')}
          onHome={goHome}
        />
      ) : null}

      {screen === 'specs' ? (
        <MySpecsScreen
          specs={specs}
          vehicles={vehicles}
          displayUnit={displayUnit}
          decimals={decimals}
          savedId={savedId}
          onUseSpec={handleUseSpec}
          onDeleteSpec={store.deleteSpec}
          onAddSpec={goConverter}
          onHome={goHome}
          onNavigate={handleNavigate}
        />
      ) : null}

      {screen === 'reference' ? (
        <BoltReferenceScreen
          decimals={decimals}
          displayUnit={displayUnit}
          onUseReference={handleUseReference}
          onHome={goHome}
          onNavigate={handleNavigate}
        />
      ) : null}

      {screen === 'vehicles' ? (
        <VehicleFoldersScreen
          vehicles={vehicles}
          specs={specs}
          onOpenFolder={() => setScreen('specs')}
          onDeleteFolder={store.deleteVehicle}
          onAddVehicle={() => setVehicleEditorOpen(true)}
          onHome={goHome}
          onNavigate={handleNavigate}
        />
      ) : null}

      {screen === 'settings' ? (
        <SettingsScreen
          defaultInput={defaultInput}
          preferredOutput={preferredOutput}
          decimals={decimals}
          haptics={haptics}
          reduceMotion={reduceMotion}
          specCount={counts.specs}
          vehicleCount={counts.vehicles}
          onChangeInput={handleChangeDefaultInput}
          onChangeOutput={handleChangePreferredOutput}
          onChangeDecimals={setDecimals}
          onToggleHaptics={setHaptics}
          onToggleMotion={setReduceMotion}
          onDeleteData={() => setClearDataOpen(true)}
          onOpenAbout={() => setScreen('about')}
          onBack={backFromSettings}
        />
      ) : null}

      {screen === 'about' ? <AboutScreen onBack={() => setScreen('settings')} /> : null}

      <SpecEditorOverlay
        visible={specEditorOpen}
        snapshot={snapshot}
        vehicles={vehicles}
        onCancel={() => setSpecEditorOpen(false)}
        onSave={handleSaveSpec}
      />

      <VehicleEditorOverlay
        visible={vehicleEditorOpen}
        existingNames={vehicles.map(v => v.name)}
        onCancel={() => setVehicleEditorOpen(false)}
        onSave={handleAddVehicle}
      />

      <ConfirmationDialog
        visible={clearDataOpen}
        title="Delete all saved data?"
        impact={
          'This removes ' +
          counts.specs +
          ' saved specs and ' +
          counts.vehicles +
          ' vehicle folders. Preferences and the bundled reference table stay.'
        }
        confirmLabel="DELETE DATA"
        cancelLabel="CANCEL"
        onConfirm={handleClearData}
        onCancel={() => setClearDataOpen(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: theme.colors.bg.primary,
  },
});

export default App;
