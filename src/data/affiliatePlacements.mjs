/**
 * Affiliate placement configuration (ESM)
 *
 * Single source of truth for CTA content across all articles.
 * Used by rehype-affiliate-cta plugin in astro.config.mjs.
 * Update URLs and copy here when affiliate programs change.
 */

const PR_NOTE = '※PR: 本記事にはアフィリエイト広告が含まれます';

export const affiliatePrograms = {
  seaCeremony: {
    name: 'シーセレモニー',
    network: 'MOSHIMO',
    rewardYen: 0,
    status: 'active',
    affiliateUrl: 'https://af.moshimo.com/af/c/click?a_id=5382116&p_id=4822&pc_id=12801&pl_id=63736',
  },
  kobo: {
    name: '小さなお墓KOBO',
    network: 'MOSHIMO',
    rewardYen: 0,
    status: 'active',
    affiliateUrl: 'https://af.moshimo.com/af/c/click?a_id=5382117&p_id=4226&pc_id=10760&pl_id=57572',
  },
};

export const affiliatePlacements = {
  top: {
    title: 'お墓・供養の新しい選択肢を確認',
    description:
      'シーセレモニーは小型クルーザーでの家族だけの海洋散骨サービス。まずは費用目安と流れを確認しましょう。',
    buttonText: 'シーセレモニーの詳細を見る →',
    affiliateUrl: affiliatePrograms.seaCeremony.affiliateUrl,
    note: PR_NOTE,
  },
  middle: {
    title: '手元供養という選択肢も検討してみませんか',
    description:
      '小さなお墓KOBOはガラス製の手元供養用のお墓。自宅で故人を偲ぶ新しいかたちです。',
    buttonText: '小さなお墓KOBOのキャンペーンを見る →',
    affiliateUrl: affiliatePrograms.kobo.affiliateUrl,
    note: PR_NOTE,
  },
  bottom: {
    title: '最終判断前に供養方法を比較',
    description:
      '海洋散骨・手元供養・従来のお墓、それぞれの費用と特徴を比較して最適な方法を選びましょう。',
    buttonText: 'シーセレモニーの最新情報を確認する →',
    affiliateUrl: affiliatePrograms.seaCeremony.affiliateUrl,
    note: PR_NOTE,
  },
};
