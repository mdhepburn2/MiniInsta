import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },

  // All Profiles screen
  profileList: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    padding: 12,
    marginBottom: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(128,128,128,0.3)',
  },
  profileCardPressed: {
    opacity: 0.6,
  },
  profileAvatar: {
    height: 72,
    width: 72,
    borderRadius: 36,
  },
  profileInfo: {
    flex: 1,
    marginLeft: 16,
    backgroundColor: 'transparent',
  },
  transparent: {
    backgroundColor: 'transparent',
  },
  profileName: {
    fontSize: 18,
    fontWeight: '600',
  },
  profileUsername: {
    fontSize: 14,
    opacity: 0.6,
    marginTop: 2,
  },

  // Single Profile screen
  profilePage: {
    flex: 1,
  },
  profileHeader: {
    alignItems: 'center',
    paddingTop: 24,
    paddingBottom: 20,
    marginBottom: 4,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(128,128,128,0.3)',
  },
  profileHeaderAvatar: {
    height: 96,
    width: 96,
    borderRadius: 48,
    marginBottom: 12,
  },
  profileHeaderName: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  profileHeaderUsername: {
    fontSize: 15,
    opacity: 0.6,
    marginTop: 2,
  },
  postGrid: {
    width: '100%',
  },
  postTile: {
    width: '33.3333%',
    aspectRatio: 1,
    padding: 1,
  },
  postImage: {
    width: '100%',
    height: '100%',
  },
})