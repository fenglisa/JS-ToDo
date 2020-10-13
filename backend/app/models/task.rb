class Task < ApplicationRecord
  validates :title, presence: true
  belongs_to :user
  scope :by_due_date, -> {order(due: :asc)}
end
