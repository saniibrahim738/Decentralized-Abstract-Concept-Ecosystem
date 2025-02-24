import { describe, it, beforeEach, expect } from "vitest"

describe("Idea Evolution Contract", () => {
  let mockStorage: Map<string, any>
  let nextIdeaId: number
  
  beforeEach(() => {
    mockStorage = new Map()
    nextIdeaId = 0
  })
  
  const mockContractCall = (method: string, args: any[] = []) => {
    switch (method) {
      case "create-idea":
        const [content, complexity, adaptability] = args
        nextIdeaId++
        mockStorage.set(`idea-${nextIdeaId}`, { content, complexity, adaptability, last_mutation: 0 })
        return { success: true, value: nextIdeaId }
      case "mutate-idea":
        const [ideaId, newContent] = args
        const idea = mockStorage.get(`idea-${ideaId}`)
        if (!idea) return { success: false, error: 404 }
        idea.content = newContent
        idea.complexity++
        idea.last_mutation = 1 // Simulating block-height change
        return { success: true }
      case "get-idea":
        return { success: true, value: mockStorage.get(`idea-${args[0]}`) }
      case "calculate-evolution-score":
        const evolvedIdea = mockStorage.get(`idea-${args[0]}`)
        if (!evolvedIdea) return { success: false, error: 404 }
        return { success: true, value: evolvedIdea.complexity + evolvedIdea.adaptability }
      default:
        return { success: false, error: "Unknown method" }
    }
  }
  
  it("should create a new idea", () => {
    const result = mockContractCall("create-idea", ["New idea", 1, 1])
    expect(result.success).toBe(true)
    expect(result.value).toBe(1)
  })
  
  it("should mutate an existing idea", () => {
    mockContractCall("create-idea", ["Original idea", 1, 1])
    const result = mockContractCall("mutate-idea", [1, "Mutated idea"])
    expect(result.success).toBe(true)
  })
  
  it("should get idea information", () => {
    mockContractCall("create-idea", ["Test idea", 2, 3])
    const result = mockContractCall("get-idea", [1])
    expect(result.success).toBe(true)
    expect(result.value).toEqual({
      content: "Test idea",
      complexity: 2,
      adaptability: 3,
      last_mutation: 0,
    })
  })
  
  it("should calculate evolution score", () => {
    mockContractCall("create-idea", ["Evolving idea", 4, 5])
    const result = mockContractCall("calculate-evolution-score", [1])
    expect(result.success).toBe(true)
    expect(result.value).toBe(9)
  })
})

