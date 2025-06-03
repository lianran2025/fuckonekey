import { PrismaClient } from '../src/generated/prisma'

const prisma = new PrismaClient()

const adjectives = ['快乐的', '神秘的', '勇敢的', '可爱的', '机智的', '酷酷的', '迷人的', '安静的', '热情的', '慵懒的', '闪亮的', '憨憨的', '优雅的', '调皮的', '呆萌的', '高冷的', '温柔的', '勤奋的', '自由的', '执着的'];
const englishNames = ['Alex', 'Sam', 'Taylor', 'Jordan', 'Casey', 'Morgan', 'Jamie', 'Riley', 'Drew', 'Skyler', 'Chris', 'Pat', 'Robin', 'Lee', 'Jessie', 'Avery', 'Charlie', 'Harper', 'Quinn', 'Reese', 'Blake', 'Cameron', 'Dakota', 'Emerson', 'Finley', 'Hayden', 'Jules', 'Kendall', 'Logan', 'Mason', 'Parker', 'Reagan', 'Sawyer', 'Terry', 'Val', 'Wynn', 'Zane', 'Hunter', 'Phoenix', 'River', 'Sage', 'Sterling'];
const animals = [
  'Fox', 'Bear', 'Wolf', 'Tiger', 'Lion', 'Panda', 'Koala', 'Otter', 'Squirrel', 'Hedgehog',
  'Rabbit', 'Raccoon', 'Dolphin', 'Parrot', 'Penguin', 'Giraffe', 'Zebra', 'Kangaroo', 'Cat', 'Dog'
];
const dicebearStyles = ['adventurer', 'bottts', 'micah', 'fun-emoji', 'notionists', 'avataaars'];

const contents = [
  'OneKey 的交互很流畅，体验不错！',
  '希望能支持更多钱包类型。',
  '界面有点简陋，建议美化一下。',
  '客服回复很快，点赞！',
  '有些功能找不到入口，建议优化导航。',
  '安全性做得很好，用着放心。',
  '英文文案有点生硬，建议润色。',
  '移动端适配还可以更好。',
  '我在使用过程中遇到了一些小 bug，但整体还不错。',
  '希望增加多语言支持，尤其是日语和韩语。',
  '官方回复很及时，社区氛围很好。',
  '产品更新频率很高，能感受到团队的用心。',
  '有时候加载速度有点慢，建议优化性能。',
  '希望能有更多教程和文档，方便新手上手。',
  'UI 很有设计感，喜欢！',
  '功能很全，但有点复杂，建议简化操作流程。',
  '钱包备份流程很清晰，安全感满满。',
  '遇到问题后，官方很快就修复了，体验很好。',
  '希望能和更多 DApp 集成。',
  '总体来说很满意，会推荐给朋友！',
  // 长内容
  '我用 OneKey 已经有一段时间了，整体体验非常棒。尤其是最近一次更新后，界面变得更加简洁，操作也更顺畅了。希望未来能继续保持高频率的优化和创新！',
  '作为一名新手用户，刚开始上手 OneKey 的时候有点迷茫，不过官方文档和社区的帮助很大。希望能有更多视频教程，帮助像我一样的小白快速入门。',
  '产品的安全性让我很放心，尤其是多重签名和硬件钱包的支持。希望未来能有更多安全相关的功能上线。',
  '有一次遇到转账卡住的问题，联系客服后很快就解决了，服务态度非常好，点赞！',
  '建议增加更多个性化设置，比如主题切换、字体大小调整等，这样可以满足不同用户的需求。',
  '希望 OneKey 能和更多主流区块链生态兼容，比如 Solana、Avalanche 等，这样就更方便了。',
  '有些功能入口比较隐蔽，建议在首页增加快捷入口，提升易用性。',
  '官方社区很活跃，很多问题都能很快得到解答，感觉很温暖。',
  '希望能有更多活动和福利，吸引更多用户参与进来。',
  '总的来说，OneKey 是一款值得信赖的钱包产品，期待越来越好！'
]

function getRandomContent() {
  return contents[Math.floor(Math.random() * contents.length)]
}

function getRandomNickname() {
  const en = englishNames[Math.floor(Math.random() * englishNames.length)]
  const animal = animals[Math.floor(Math.random() * animals.length)]
  return `${en} ${animal}`
}

function getRandomAvatar(nickname: string) {
  const style = dicebearStyles[Math.floor(Math.random() * dicebearStyles.length)]
  const seed = `${nickname}-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`
  return `https://api.dicebear.com/7.x/${style}/svg?seed=${encodeURIComponent(seed)}`
}

async function main() {
  for (let i = 0; i < 20; i++) {
    const nickname = getRandomNickname()
    const avatar = getRandomAvatar(nickname)
    const content = getRandomContent()
    await prisma.oneKeyFeedback.create({
      data: {
        content,
        ip: '127.0.0.1',
        avatar,
        nickname,
      },
    })
  }
  console.log('已生成20条随机长短不一、头像昵称更有趣的评论')
}

main().finally(() => prisma.$disconnect())