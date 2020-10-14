class User < ApplicationRecord
  validates :name, presence: true, uniqueness: true
  before_validation :normalize_name
  has_many :tasks

  private
  def normalize_name
    self.name = name.downcase.titleize
  end
end
