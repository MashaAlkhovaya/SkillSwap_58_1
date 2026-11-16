type Listener = () => void

const pending = new Set<string>()
const listeners = new Set<Listener>()

let snapshot: ReadonlySet<string> = pending

const commit = () => {
  snapshot = new Set(pending)
  listeners.forEach((listener) => listener())
}

export const pendingLikes = {
  add(id: string): void {
    if (!pending.has(id)) {
      pending.add(id)
      commit()
    }
  },
  remove(id: string): void {
    if (pending.delete(id)) {
      commit()
    }
  },
  hasId(id: string): boolean {
    return snapshot.has(id)
  },
  subscribe(listener: Listener): () => void {
    listeners.add(listener)

    return () => {
      listeners.delete(listener)
    }
  },
}
