;; Idea Evolution Contract

(define-map ideas
  { idea-id: uint }
  {
    content: (string-utf8 256),
    complexity: uint,
    adaptability: uint,
    last-mutation: uint
  }
)

(define-data-var next-idea-id uint u0)

(define-public (create-idea (content (string-utf8 256)) (complexity uint) (adaptability uint))
  (let
    ((new-id (+ (var-get next-idea-id) u1)))
    (var-set next-idea-id new-id)
    (ok (map-set ideas
      { idea-id: new-id }
      {
        content: content,
        complexity: complexity,
        adaptability: adaptability,
        last-mutation: block-height
      }
    ))
  )
)

(define-public (mutate-idea (idea-id uint) (new-content (string-utf8 256)))
  (let
    ((idea (unwrap! (map-get? ideas { idea-id: idea-id }) (err u404))))
    (ok (map-set ideas
      { idea-id: idea-id }
      (merge idea {
        content: new-content,
        complexity: (+ (get complexity idea) u1),
        last-mutation: block-height
      })
    ))
  )
)

(define-read-only (get-idea (idea-id uint))
  (map-get? ideas { idea-id: idea-id })
)

(define-read-only (calculate-evolution-score (idea-id uint))
  (let
    ((idea (unwrap! (map-get? ideas { idea-id: idea-id }) (err u404))))
    (ok (+ (get complexity idea) (get adaptability idea)))
  )
)

