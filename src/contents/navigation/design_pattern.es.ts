import { ItemSideMenu } from '@/modules/blogs/model/ItemSideMenu'

const items: ItemSideMenu[] = [
  {
    title: 'Patrón de Diseño',
    url: '#',
  },
  {
    title: 'Patrones Creacionales',
    submenu: [
      {
        title: 'Patrón Singleton',
        url: '#',
      },
      {
        title: 'Patrón Método Fábrica',
        url: '#',
      },
      {
        title: 'Patrón Fábrica Abstracta',
        url: '#',
      },
      {
        title: 'Patrón Constructor',
        url: '#',
      },
      {
        title: 'Patrón Prototipo',
        url: '#',
      },
    ],
  },
  {
    title: 'Patrones Estructurales',
    submenu: [
      {
        title: 'Patrón Adaptador',
        url: '#',
      },
      {
        title: 'Patrón Puente',
        url: '#',
      },
      {
        title: 'Patrón Compuesto',
        url: '#',
      },
      {
        title: 'Patrón Decorador',
        url: '#',
      },
      {
        title: 'Patrón Fachada',
        url: '#',
      },
      {
        title: 'Patrón Peso Ligero',
        url: '#',
      },
      {
        title: 'Patrón Proxy',
        url: '#',
      },
    ],
  },
  {
    title: 'Patrones de Comportamiento',
    submenu: [
      {
        title: 'Patrón Cadena de Responsabilidad',
        url: '#',
      },
      {
        title: 'Patrón Comando',
        url: '#',
      },
      {
        title: 'Patrón Intérprete',
        url: '#',
      },
      {
        title: 'Patrón Iterador',
        url: '#',
      },
      {
        title: 'Patrón Mediador',
        url: '#',
      },
      {
        title: 'Patrón Memento',
        url: '#',
      },
      {
        title: 'Patrón Observador',
        url: '#',
      },
      {
        title: 'Patrón Estado',
        url: '#',
      },
      {
        title: 'Patrón Estrategia',
        url: '#',
      },
      {
        title: 'Patrón Método Plantilla',
        url: '#',
      },
      {
        title: 'Patrón Visitante',
        url: '#',
      },
    ],
  },
]

export default items
