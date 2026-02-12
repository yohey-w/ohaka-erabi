export interface AffiliateProgram {
  name: string;
  network: 'A8';
  rewardYen: number;
  status: 'active' | 'pending' | 'url_pending';
  affiliateUrl: string;
}

export interface AffiliatePlacement {
  title: string;
  description: string;
  buttonText: string;
  affiliateUrl: string;
  note: string;
}

const PR_NOTE = '※PR: 本記事にはアフィリエイト広告が含まれます';

export const affiliatePrograms = {
  ohakaClosures: {
    name: '墓じまいサービス比較窓口',
    network: 'A8',
    rewardYen: 30000,
    status: 'pending',
    affiliateUrl: 'https://example.com/affiliate/placeholder-ohaka-1',
  },
} as const satisfies Record<string, AffiliateProgram>;

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
} as const satisfies Record<'top' | 'middle' | 'bottom', AffiliatePlacement>;
