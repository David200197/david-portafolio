import { ItemSideMenu } from '@/modules/blogs/model/ItemSideMenu'

const items: ItemSideMenu[] = [
  {
    title: 'Design Pattern',
    url: '#',
  },
  {
    title: 'Creational Patterns',
    submenu: [
      {
        title: 'Singleton Pattern',
        url: '#',
      },
      {
        title: 'Factory Method Pattern',
        url: '#',
      },
      {
        title: 'Abstract Factory Pattern',
        url: '#',
      },
      {
        title: 'Builder Pattern',
        url: '#',
      },
      {
        title: 'Prototype Pattern',
        url: '#',
      },
    ],
  },
  {
    title: 'Structural Patterns',
    submenu: [
      {
        title: 'Adapter Pattern',
        url: '#',
      },
      {
        title: 'Bridge Pattern',
        url: '#',
      },
      {
        title: 'Composite Pattern',
        url: '#',
      },
      {
        title: 'Decorator Pattern',
        url: '#',
      },
      {
        title: 'Facade Pattern',
        url: '#',
      },
      {
        title: 'Flyweight Pattern',
        url: '#',
      },
      {
        title: 'Proxy Pattern',
        url: '#',
      },
    ],
  },
  {
    title: 'Behavioral Patterns',
    submenu: [
      {
        title: 'Chain of Responsibility Pattern',
        url: '#',
      },
      {
        title: 'Command Pattern',
        url: '#',
      },
      {
        title: 'Interpreter Pattern',
        url: '#',
      },
      {
        title: 'Iterator Pattern',
        url: '#',
      },
      {
        title: 'Mediator Pattern',
        url: '#',
      },
      {
        title: 'Memento Pattern',
        url: '#',
      },
      {
        title: 'Observer Pattern',
        url: '#',
      },
      {
        title: 'State Pattern',
        url: '#',
      },
      {
        title: 'Strategy Pattern',
        url: '#',
      },
      {
        title: 'Template Method Pattern',
        url: '#',
      },
      {
        title: 'Visitor Pattern',
        url: '#',
      },
    ],
  },
]

export default items
