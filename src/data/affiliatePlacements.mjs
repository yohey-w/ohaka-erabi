/**
 * Affiliate placement configuration (ESM)
 *
 * Single source of truth for CTA content across all articles.
 * Used by rehype-affiliate-cta plugin in astro.config.mjs.
 * Update URLs and copy here when affiliate programs change.
 */

const PR_NOTE = '※PR: 本記事にはアフィリエイト広告が含まれます';

export const affiliatePrograms = {
  ohakaClosures: {
    name: 'わたしたちの墓じまい',
    network: 'A8',
    rewardYen: 30000,
    status: 'pending',
    affiliateUrl: '',
  },
};

export const affiliatePlacements = {
  top: {
    title: '墓じまいの無料相談で費用目安を確認',
    description:
      '改葬先や離檀料を含めて、まずは全体費用の目安を把握しておくと比較が進めやすくなります。',
    buttonText: '墓じまいの無料相談を確認する →',
    affiliateUrl: affiliatePrograms.ohakaClosures.affiliateUrl,
    note: PR_NOTE,
  },
  middle: {
    title: '進め方に迷う場合は専門窓口で整理',
    description:
      '手続き順序や必要書類を先に確認しておくことで、見積もり比較の精度を上げられます。',
    buttonText: '墓じまい手順の相談先を見る →',
    affiliateUrl: affiliatePrograms.ohakaClosures.affiliateUrl,
    note: PR_NOTE,
  },
  bottom: {
    title: '最終判断前に条件を再チェック',
    description:
      '追加費用や対応範囲を再確認し、納得できる条件で依頼先を決定しましょう。',
    buttonText: '墓じまい見積もりの条件を再確認する →',
    affiliateUrl: affiliatePrograms.ohakaClosures.affiliateUrl,
    note: PR_NOTE,
  },
};
