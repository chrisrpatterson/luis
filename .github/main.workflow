workflow "Build, Test, and Publish" {
  on = "push"
  resolves = ["Test"]
}

action "Install Packages" {
  uses = "borales/actions-yarn@master"
  args = "install"
}

action "Build" {
  needs = ["Install Packages"]
  uses = "borales/actions-yarn@master"
  args = "build"
}

action "Test" {
  needs = ["Build"]
  uses = "borales/actions-yarn@master"
  args = "test"
}

