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
  hakajimai: {
    name: 'わたしたちの墓じまい',
    network: 'A8',
    rewardYen: 30000,
    status: 'active',
    affiliateUrl: 'https://px.a8.net/svt/ejp?a8mat=4AX9GA+6WVBI2+5HQW+5YRHE',
  },
};

export const affiliatePlacements = {
  top: {
    title: '墓じまいの無料相談先を確認',
    description:
      '「わたしたちの墓じまい」は墓じまいの手続き、改葬先探し、行政届出まで一括サポート。費用目安と流れをまとめて確認できます。',
    buttonText: 'わたしたちの墓じまいに無料相談する →',
    affiliateUrl: affiliatePrograms.hakajimai.affiliateUrl,
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
    title: '海洋散骨という選択肢も確認',
    description:
      'シーセレモニーは小型クルーザーで家族だけの海洋散骨に対応。供養の選択肢を広げたい方はサービス詳細を確認できます。',
    buttonText: 'シーセレモニーの詳細を見る →',
    affiliateUrl: affiliatePrograms.seaCeremony.affiliateUrl,
    note: PR_NOTE,
  },
};
