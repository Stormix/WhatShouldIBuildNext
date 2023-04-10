import { ComponentType, PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  // Delete all components
  await prisma.component.deleteMany({});

  // Create components
  const components = {
    [ComponentType.What]: [
      'a social network',
      'a news aggregator',
      'a chatbot',
      'an e-commerce platform',
      'a project management tool',
      'a personal finance tracker',
      'a music streaming service',
      'a video game',
      'a language learning app',
      'a fitness tracker',
      'a smart home automation system',
      'a delivery service',
      'a productivity tool for remote teams',
      'a mobile app',
      'a recommendation engine',
      'an exchange platform'
    ],
    [ComponentType.For]: [
      'students',
      'small businesses',
      'freelancers',
      'travelers',
      'book lovers',
      'pet owners',
      'foodies',
      'fashion enthusiasts',
      'sports fans',
      'musicians',
      'stay-at-home parents',
      'startup founders',
      'adventure travelers',
      'cycling enthusiasts',
      'music festival goers',
      'book club members',
      'dog walkers',
      'podcast creators',
      'retirees',
      'coffee aficionados'
    ],
    [ComponentType.Using]: [
      'React',
      'Vue',
      'Angular',
      'Node.js',
      'Ruby on Rails',
      'Django',
      'Flask',
      'Laravel',
      'Express.js',
      'Spring Boot',
      'React Native',
      'Flutter',
      'Next.js',
      'Gatsby',
      'GraphQL',
      'Prisma',
      'MongoDB',
      'Firebase',
      'Amazon Web Services',
      'Google Cloud Platform'
    ],
    [ComponentType.On]: ['iOS', 'Android', 'Web', 'Desktop', 'IoT', 'Cloud', 'Blockchain'],
    [ComponentType.But]: [
      'with a minimalist design',
      'without using any external libraries',
      'optimized for low-bandwidth connections',
      'without using a database',
      'with voice commands integration',
      'using only open-source software',
      'with a maximum page load time of 2 seconds',
      'optimized for users with color blindness',
      'with a focus on accessibility',
      'with a limit of 100 lines of code',
      'without a backend',
      'without any styling',
      'using natural language processing',
      'with a gamified user interface',
      'without a mouse or keyboard',
      'optimized for ultra-low latency',
      'with augmented reality integration',
      'with biometric authentication',
      'using machine learning',
      'with a focus on sustainability',
      'with a maximum memory usage of 512MB',
      'using only functional programming',
      'without using any CSS',
      'with a 24-hour time limit'
    ]
  };

  const componentTypes = Object.keys(components) as ComponentType[];

  for (const componentType of componentTypes) {
    const componentTypeValues = components[componentType];

    for (const componentTypeValue of componentTypeValues) {
      await prisma.component.create({
        data: {
          type: componentType,
          value: componentTypeValue
        }
      });
    }
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
