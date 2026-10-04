const LEAGUES = [
  { id: 'normal', name: 'ノーマル', rate: 1.0, desc: '標準的なリーグ', icon: '⚾' },
  { id: 'batting', name: '打撃', rate: 1.3, desc: 'ミート・パワー・球速が伸びやすい', icon: '🔥' },
  { id: 'pitching', name: '投手', rate: 1.3, desc: '投手全般がすくすく育つ', icon: '🛡️' },
  { id: 'super', name: 'スーパー', rate: 1.5, desc: 'ノーマルの上位互換', icon: '⭐' },
  { id: 'hyper', name: 'ハイパー', rate: 2.0, desc: 'さらなる高みを目指すリーグ', icon: '💫' },
  { id: 'magic', name: 'マジック', rate: 2.5, desc: '何が起こるかお楽しみの特殊枠', icon: '✨' },
  { id: 'master', name: 'マスター', rate: 3.0, desc: '屈指の強豪が集うハイレベルリーグ', icon: '👑' },
  { id: 'fugo', name: '富豪', rate: 5.0, desc: '成長は控えめだがポイント荒稼ぎ！', icon: '💰' }
];

const PITCHER_IND = ['剛腕', '多彩な変化球', 'ピンチはチャンス', '精密機械', 'ロケットストレート', '余裕の風格'];
const BATTER_IND = ['威圧', 'パワーヒッター', '安打製造機', '韋駄天', '勝負師', 'リードオフマン'];
const BREAKING_BALLS = ['カーブ', 'スライダー', 'カットボール', 'フォーク', 'チェンジアップ', 'シュート', 'シンカー', 'ツーシーム', 'ナックル', '縦スライダー'];