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
    ],
    [ComponentType.On]: [
      'iOS',
      'Android',
      'Web',
      'Desktop',
      'IoT',
      'Smartwatches',
      'Smart TVs',
      'Virtual Reality',
      'Augmented Reality',
      'Mixed Reality',
    ],
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
