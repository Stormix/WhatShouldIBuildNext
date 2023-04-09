import { ComponentType, PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  // Delete all components
  await prisma.component.deleteMany({});

  // Create components
  const components = {
    [ComponentType.What]: ['an app', 'a website'],
    [ComponentType.For]: ['a client', 'a customer', 'a user', 'a visitor'],
    [ComponentType.Using]: ['React', 'Vue', 'Angular', 'Svelte'],
    [ComponentType.On]: ['Web', 'Mobile', 'Desktop'],
    [ComponentType.But]: ['with limitations', 'with restrictions', 'with limitations and restrictions']
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
