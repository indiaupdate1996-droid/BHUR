import {
  AdMob,
  RewardAdPluginEvents
} from '@capacitor-community/admob';

const TEST_REWARDED_ID =
  'ca-app-pub-3940256099942544/5224354917';

let adReady = false;

export async function initAdMob() {
  try {
    await AdMob.initialize();

    await AdMob.addListener(
      RewardAdPluginEvents.Loaded,
      () => {
        adReady = true;
        window.dispatchEvent(new CustomEvent('admob-ready'));
      }
    );

    await AdMob.addListener(
      RewardAdPluginEvents.FailedToLoad,
      () => {
        adReady = false;
      }
    );

    await prepareRewardAd();
  } catch (e) {
    console.log('AdMob init error:', e);
  }
}

export async function prepareRewardAd() {
  try {
    adReady = false;

    await AdMob.prepareRewardVideoAd({
      adId: TEST_REWARDED_ID
    });
  } catch (e) {
    console.log('Reward ad load error:', e);
  }
}

export async function showRewardAd() {
  if (!adReady) {
    await prepareRewardAd();
    return false;
  }

  try {
    const reward = await AdMob.showRewardVideoAd();

    adReady = false;
    await prepareRewardAd();

    return !!reward;
  } catch (e) {
    console.log('Reward ad show error:', e);
    return false;
  }
}

window.BhurAdMob = {
  initAdMob,
  prepareRewardAd,
  showRewardAd
};
