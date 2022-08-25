import { PAGINATION_QUERY } from '../components/Pagination';

export default function paginationField() {
  return {
    keyArgs: false, // tells apollo we will take care of everything
    read(existing = [], { args, cache }) {
      const { skip, first } = args;
      // read the # of items on page from cache
      const data = cache.readQuery({ query: PAGINATION_QUERY });
      const count = data?._allProductsMeta?.count;
      const page = skip / first + 1;
      const pages = Math.ceil(count / first);
      // check if we have existing items
      const items = existing.slice(skip, skip + first).filter((x) => x);
      // if there are items AND there aren't enough items to satisfy how many were requested AND we are on the last page - send it anyway
      if (items.length && items.length !== first && page === pages) {
        return items;
      }
      if (items.length !== first) {
        // we do not have any items, must go to the network to fetch them
        return false;
      }
      // if there are items, return from cache
      if (items.length) {
        return items;
      }
      // first - asks read function for items.
      // two options
      // first is return items because they are already in cache
      // second is to return false (network request)
    },
    merge(existing, incoming, { args }) {
      const { skip, first } = args
      // this runs when the Apollo client comes back from the network with our product
      const merged = existing ? existing.slice(0) : [];
      for (let i = skip; i < skip + incoming.length; ++i) {
        merged[i] = incoming[i - skip];
      }
      // finally we return the merged items from the cache
      return merged;
    },
  };
}
